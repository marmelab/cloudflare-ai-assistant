<script setup lang="ts">
import { themeChange } from "theme-change";
import { ref } from "vue";

onMounted(async () => {
  themeChange(false);
});

useHead({
  title: "Marmelab Assistant",
  meta: [{ name: "description", content: "A demo AI assistant" }],
});

const prompt = ref<string>("");
const submitButton = ref<HTMLButtonElement | null>(null);

const { loading, sendPrompt } = usePrompt();

function submit() {
  submitButton.value?.click?.();
}

function handleVoiceRecorded(recordedText: string) {
  if (!prompt.value) {
    prompt.value = recordedText;
  }
}

async function onSubmit(event: Event) {
  event.preventDefault();

  const promptFormValue = prompt.value.trim();
  if (loading.value || !promptFormValue) {
    return;
  }

  await sendPrompt(promptFormValue);

  prompt.value = "";
}
</script>

<template data-theme="cupcake">
  <div class="flex flex-col h-screen">
    <header class="bg-accent text-white p-4 flex items-center">
      <div class="flex items-center">
        <h1 class="text-lg font-bold">AI Assistant</h1>
        <span class="text-xs ml-2">Powered by Marmelab</span>
      </div>
    </header>
    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <BotMessage>BOT</BotMessage>
      <SenderMessage>TOTO</SenderMessage>
      <SenderMessage>TOTO</SenderMessage>
    </div>
    <form
      @submit="onSubmit"
      class="bg-gray-100 dark:bg-gray-950 p-4 flex items-center"
    >
      <textarea
        class="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 p-2 mr-2 flex-grow"
        placeholder="Type your message..."
        v-model="prompt"
        @keydown.meta.enter="submit"
        @keydown.ctrl.enter="submit"
        :disabled="loading"
      />

      <MicrophoneButton
        v-if="!prompt"
        v-bind:onRecordedText="handleVoiceRecorded"
      />
      <button
        type="submit"
        ref="submitButton"
        class="btn btn-circle btn-primary"
        :disabled="loading"
        v-else
      >
        <span class="loading loading-spinner" v-if="loading" />
        <SendIcon v-else />
      </button>
    </form>
  </div>
</template>
