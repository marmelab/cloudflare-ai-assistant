<script setup lang="ts">
import { ref } from "vue";
import useRecorder from "~/composables/useRecorder.js";

const props = defineProps<{
  onRecordedText: (text: string) => void;
}>();

const {
  microphoneDisabled,
  loading,
  recording,
  recordedText,
  startRecording,
  stopRecording,
} = useRecorder();

watch(recordedText, (newRecordedText) => {
  if (!newRecordedText) {
    return;
  }

  props.onRecordedText(newRecordedText);
});

const handleMouseDown = (e: MouseEvent | TouchEvent) => {
  e.preventDefault();
  startRecording();
};

const handleMouseUp = (e: MouseEvent | TouchEvent) => {
  e.preventDefault();
  stopRecording();
};

const handleContextMenu = (e: MouseEvent | TouchEvent) => {
  e.preventDefault();
};
</script>

<template>
  <button
    @contextmenu="handleContextMenu"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @touchdown="handleMouseDown"
    @touchup="handleMouseUp"
    :disabled="microphoneDisabled"
    type="button"
  >
    {{
      loading
        ? "Transcribing audio"
        : recording
        ? "Listening for prompts"
        : "Voice"
    }}
  </button>
</template>