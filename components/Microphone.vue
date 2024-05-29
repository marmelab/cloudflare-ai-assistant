<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  onPrompt: (text: string) => void;
}>();

const microphoneDisabled = ref<boolean>(false);
const listening = ref<boolean>(false);
const loading = ref<boolean>(false);

const stream = ref<MediaStream | null>(null);
const recorder = ref<MediaRecorder | null>(null);

function cleanUpStream() {
  recorder.value?.stop?.();

  const tracks = stream?.value?.getTracks() ?? [];
  for (const track of tracks) {
    track.stop();
  }

  recorder.value = null;
  stream.value = null;
}

async function handleVoiceToggle() {
  listening.value = !listening.value;

  if (listening.value) {
    try {
      microphoneDisabled.value = false;

      stream.value = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

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

            props.onPrompt?.(text);
          })
          .finally(function () {
            loading.value = false;
          });
      });

      recorder.value.start();
    } catch (e) {
      console.error("Encountered error while requesting audio", e);
      microphoneDisabled.value = true;
      cleanUpStream();
    }
  } else {
    recorder.value?.stop?.();
    cleanUpStream();
  }
}

onBeforeUnmount(cleanUpStream);
</script>

<template>
  <button
    @click="handleVoiceToggle"
    :disabled="microphoneDisabled || loading"
    type="button"
  >
    {{
      loading
        ? "Transcribing audio"
        : listening
        ? "Listening for prompts"
        : "Voice disabled"
    }}
  </button>
</template>