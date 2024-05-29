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

const promptInput = ref<HTMLTextAreaElement | null>(null);
const submitButton = ref<HTMLButtonElement | null>(null);

const isSubmitDisabled = ref<boolean>(true);
const { loading, sendPrompt } = usePrompt();

function handleKeyUp() {
  isSubmitDisabled.value = !promptInput?.value?.value?.trim?.();
}

function submit() {
  submitButton.value?.click?.();
}

function handleVoiceRecorded(prompt: string) {
  if (promptInput.value) {
    promptInput.value.value = prompt;
    handleKeyUp();
  }
}

async function onSubmit(event: Event) {
  event.preventDefault();

  if (!(event.target instanceof HTMLFormElement) || loading.value) {
    return;
  }

  const formData = new FormData(event.target);

  const prompt = formData.get("prompt");
  if (promptInput.value) {
    promptInput.value.value = "";
    handleKeyUp();
  }

  if (typeof prompt !== "string") {
    return;
  }
  sendPrompt(prompt);
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
    <div class="bg-gray-100 dark:bg-gray-950 p-4 flex items-center">
      <textarea
        class="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 p-2 mr-2"
        placeholder="Type your message..."
      />
      <button>
        <span class="sr-only">Send</span>
      </button>
    </div>
  </div>
</template>
