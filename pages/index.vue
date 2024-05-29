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
    <h1 class="text-3xl font-bold underline bg-red-400">Hello world!</h1>
    <div class="avatar">
        <div class="w-24 mask mask-triangle">
            <img
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
            />
        </div>
    </div>
    <select data-choose-theme>
  <option value="cupcake">Default</option>
  <option value="synthwave">synthwave</option>
  <option value="cupcake">cupcake</option>
  <option value="dark">dark</option>
</select>

    <form @submit="onSubmit">
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

        <Microphone v-bind:onPrompt="handleAudioPrompt" />

        <button
            type="submit"
            ref="submitButton"
            :disabled="isSubmitDisabled || loading"
        >
            {{ loading.value ? 'Loading' : 'Generate' }}
        </button>
    </form>
</template>
