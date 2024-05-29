<script setup lang="ts">
import { watch } from "vue";
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
    :class="`btn btn-circle ${recording ? 'btn-success' : 'btn-primary'}`"
  >
    <span class="loading loading-spinner" v-if="loading" />
    <MicrophoneIcon v-else />
  </button>
</template>