<script setup lang="ts">
const props = defineProps<{
  content: string;
}>();
</script>


<template>
  <div class="flex items-center justify-end gap-2">
    <div class="bg-primary text-white rounded-lg p-3">
      <p>
        {{ props.content }}
      </p>
    </div>
    <div class="avatar placeholder">
      <div class="bg-neutral text-neutral-content rounded-full w-6">
        <span class="text-xs">Y</span>
      </div>
    </div>
  </div>
</template>
