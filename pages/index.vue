<script setup lang="ts">
import { ref } from 'vue';
import { themeChange } from 'theme-change';

onMounted(async () => {
    themeChange(false);
});

useHead({
    title: 'Marmelab Assistant',
    meta: [{ name: 'description', content: 'A demo AI assistant' }],
});

const promptInput = ref<HTMLTextAreaElement | null>(null);
const submitButton = ref<HTMLButtonElement | null>(null);

const isSubmitDisabled = ref<boolean>(true);
const { loading, generatedText, sendPrompt } = usePrompt();

function handleKeyUp() {
    isSubmitDisabled.value = !promptInput?.value?.value?.trim?.();
}

function submit() {
    submitButton.value?.click?.();
}

function handleAudioPrompt(prompt: string) {
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

    const prompt = formData.get('prompt');
    if (promptInput.value) {
        promptInput.value.value = '';
        handleKeyUp();
    }

    if (typeof prompt !== 'string') {
        return;
    }
    sendPrompt(prompt);
}
</script>

<style>
textarea {
    resize: none;
}

textarea.result {
    flex-grow: 1;
}
</style>

<template data-theme="cupcake">
    <div className="flex flex-col h-screen">
        <header className="bg-gray-900 text-white p-4 flex items-center">
            <div className="flex items-center">
                <BotIcon className="h-6 w-6 mr-2" />
                <h1 className="text-lg font-bold">ChatGPT</h1>
            </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex items-start">
                <Avatar className="mr-2">
                    <AvatarImage alt="You" src="/placeholder-user.jpg" />
                    <AvatarFallback>YO</AvatarFallback>
                </Avatar>
                <div
                    className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-[70%]"
                >
                    <p>
                        Hi there! Can you explain what causes airplane
                        turbulence?
                    </p>
                </div>
            </div>
            <div className="flex items-start justify-end">
                <div
                    className="bg-blue-500 text-white rounded-lg p-3 max-w-[70%]"
                >
                    <p>
                        Airplane turbulence happens when the plane encounters
                        pockets of air that are moving differently. It's like
                        sailing a boat on choppy water. These air pockets can
                        make the plane feel like it's bouncing or shaking a bit.
                        It's completely normal and usually not dangerous at all.
                    </p>
                </div>
                <Avatar className="ml-2">
                    <AvatarImage alt="ChatGPT" src="/placeholder-user.jpg" />
                    <AvatarFallback>OA</AvatarFallback>
                </Avatar>
            </div>
            <div className="flex items-start">
                <Avatar className="mr-2">
                    <AvatarImage alt="You" src="/placeholder-user.jpg" />
                    <AvatarFallback>YO</AvatarFallback>
                </Avatar>
                <div
                    className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-[70%]"
                >
                    <p>That makes sense, thanks for the explanation!</p>
                </div>
            </div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-950 p-4 flex items-center">
            <Textarea
                className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 p-2 mr-2"
                placeholder="Type your message..."
            />
            <Button>
                <ArrowUpIcon className="h-4 w-4" />
                <span className="sr-only">Send</span>
            </Button>
        </div>
    </div>

    <!-- <form @submit="onSubmit">
    <textarea class="result" :disabled="loading" v-model="generatedText" />
    <label>
      Enter your prompt
      <textarea
        rows="8"
        name="prompt"
        ref="promptInput"
        @keyup="handleKeyUp"
        @keypress="handleKeyUp"
        @keydown.meta.enter="submit"
        @keydown.ctrl.enter="submit"
      />
    </label>
    <Microphone v-bind:onRecordedText="handleVoicePrompt" />

    <button
      type="submit"
      ref="submitButton"
      :disabled="isSubmitDisabled || loading"
    >
      {{ loading.value ? "Loading" : "Generate" }}
    </button>
  </form> -->
</template>
