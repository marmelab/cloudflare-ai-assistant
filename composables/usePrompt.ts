import { ref } from "vue";

export type Prompt = {
  role: "user" | "assistant";
  content: string;
};

export default function usePrompt() {
  // public API
  const messages = ref<Prompt[]>([]);
  const loading = ref<boolean>(false);

  async function sendPrompt(prompt: string) {
    const trimedPrompt = prompt.trim();
    if (!trimedPrompt || loading.value) {
      // TODO: handle error
      return;
    }

    messages.value = [
      ...messages.value,
      {
        role: "user",
        content: trimedPrompt,
      },
    ];

    loading.value = true;

    const currentMessages = [...messages.value];
    messages.value = [
      ...messages.value,
      {
        role: "assistant",
        content: "",
      },
    ];

    await fetch("/api/prompt", {
      method: "POST",
      headers: [["Content-Type", "application/json"]],
      body: JSON.stringify({ messages: messages.value }),
    })
      .then(async (response) => {
        if (response.status !== 200 || !response.body) {
          // TODO: handle error
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        if (!reader) {
          return;
        }

        let responseBody = "";
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          responseBody += decoder.decode(value);

          const content = responseBody
            .split("data:")
            .map((part) => {
              const json = part.trim();
              if (!json || json === "[DONE]") {
                return null;
              }

              try {
                const { response } = JSON.parse(json) as { response: string };
                return response;
              } catch {
                return null;
              }
            })
            .filter((part) => part !== null)
            .join("");

          messages.value = [
            ...currentMessages,
            {
              role: "assistant",
              content,
            },
          ];
        }
      })
      .finally(function () {
        loading.value = false;
      });
  }

  return {
    loading,
    messages,
    sendPrompt,
  };
}
