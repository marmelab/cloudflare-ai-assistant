<style>
pre {
  white-space: pre-wrap; /* Since CSS 2.1 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
}
</style>

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
const messagesContainer = ref<HTMLDivElement | null>(null);
const displayModeDirect = ref<boolean>(true);

const isSubmitDisabled = ref<boolean>(true);
const { loading, sendPrompt, messages } = usePrompt();

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

let lastAssistantMessage = ref(null);

watch(messages, (newMessages) => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });

  lastAssistantMessage.value = newMessages.findLast(
    (message) => message.role === "assistant"
  );
});

console.log("lastAssistantMessage", lastAssistantMessage.value);
</script>

<template data-theme="cupcake">
  <div class="flex flex-col h-screen">
    <header class="bg-accent text-white p-4 flex items-center justify-between">
      <div class="flex items-center">
        <h1 class="text-lg font-bold">AI Assistant</h1>
        <span class="text-xs ml-2">Powered by Marmelab</span>
      </div>
      <div class="flex gap-2">
        <div class="bg-white p-1 rounded-lg flex gap-2 items-center">
          🙀
          <input
            type="checkbox"
            class="toggle toggle-primary toggle-sm"
            v-model="displayModeDirect"
          />
          💻
        </div>
      </div>
    </header>
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
      <div
        v-if="messages.length === 0"
        class="flex items-center justify-center h-full"
      >
        <div
          class="flex flex-col items-center border-2 border-gray-200 rounded-lg p-12 text-center"
        >
          <img
            src="https://images.opencollective.com/marmelab/d7fd82f/logo/256.png"
            alt="No messages yet"
            width="40"
          />
          <p class="mt-4 text-lg font-semibold text-gray-700">
            No messages yet. Start a conversation!
          </p>
        </div>
      </div>
      <div
        v-if="displayModeDirect && messages.length > 0"
        class="h-full container mx-auto"
      >
        <div
          v-if="lastAssistantMessage?.content"
          class="flex w-full h-full gap-2"
        >
          <div class="avatar placeholder">
            <div class="bg-neutral text-neutral-content rounded-full w-6 h-6">
              <span class="text-xs">A</span>
            </div>
          </div>
          <pre>{{ lastAssistantMessage?.content }}</pre>
        </div>
        <div v-else class="flex items-center justify-center h-full">
          <span
            className="justify-center loading loading-dots loading-lg"
          ></span>
        </div>
      </div>
      <div
        v-else
        v-for="(message, index) in messages"
        :key="index"
        class="container mx-auto"
      >
        <BotMessage
          v-if="message.role === 'assistant'"
          :content="message.content"
        />
        <SenderMessage
          v-else-if="message.role === 'user'"
          :content="message.content"
        />
      </div>
    </div>
    <form @submit="onSubmit">
      <div class="bg-gray-100 p-4 flex items-center">
        <textarea
          class="flex-1 rounded-lg border border-gray-300 p-2 mr-2 flex-grow"
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
      </div>
    </form>
  </div>
</template>
