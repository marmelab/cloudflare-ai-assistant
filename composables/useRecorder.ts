import { onBeforeUnmount, ref } from "vue";

export default function useRecorder() {
  // Private API
  const stream = ref<MediaStream | null>(null);
  const recorder = ref<MediaRecorder | null>(null);

  // Public API
  const microphoneDisabled = ref<boolean>(false);
  const recording = ref<boolean>(false);
  const loading = ref<boolean>(false);
  const recordedText = ref<string>("");

  const stopRecording = async () => {
    recording.value = false;
    recorder.value?.stop?.();

    const tracks = stream?.value?.getTracks() ?? [];
    for (const track of tracks) {
      track.stop();
    }

    recorder.value = null;
    stream.value = null;
  };

  const startRecording = async () => {
    microphoneDisabled.value = false;

    try {
      stream.value = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      recording.value = true;

      let chunks: BlobPart[] = [];
      recorder.value = new MediaRecorder(stream.value, {
        mimeType: "audio/webm",
      });

      recorder.value.addEventListener("dataavailable", function (e) {
        chunks.push(e.data);
      });

      recorder.value.addEventListener("stop", function () {
        const blob = new Blob(chunks, { type: "audio/webm" });

        loading.value = true;
        fetch("/api/voice", {
          method: "POST",
          body: blob,
        })
          .then(async (response) => {
            if (response.status !== 200 || !response.body) {
              return;
            }

            const { text } = (await response.json()) as { text: string };
            if (!text) {
              return;
            }

            recordedText.value = text;
          })
          .finally(function () {
            loading.value = false;
          });
      });

      recorder.value.start();
    } catch (e) {
      console.error("Encountered error while requesting audio", e);
      microphoneDisabled.value = true;
      stopRecording();
    }
  };

  onBeforeUnmount(stopRecording);

  return {
    microphoneDisabled,
    recording,
    loading,
    recordedText,
    startRecording,
    stopRecording,
  };
}
