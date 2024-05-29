<script setup lang="ts">
const props = defineProps<{
  content: string;
}>();
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="avatar placeholder">
      <div class="bg-neutral text-neutral-content rounded-full w-6">
        <span class="text-xs">A</span>
      </div>
    </div>
    <div class="bg-secondary dark:bg-gray-800 rounded-lg p-3">
      <pre v-if="content">{{ props.content }}</pre>
      <div v-else>
        <div class="flex space-x-2 animate-pulse">
          <div class="w-1 h-1 bg-white rounded-full"></div>
          <div class="w-1 h-1 bg-white rounded-full"></div>
          <div class="w-1 h-1 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
</template>
