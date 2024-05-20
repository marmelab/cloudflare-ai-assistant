type Prompt = {
  role: "user" | "assistant";
  content: string;
};

export default function usePrompt() {
  // internal
  const messages = ref<Prompt[]>([]);

  // public API
  const loading = ref<boolean>(false);
  const generatedText = ref<string>("");

  function sendPrompt(prompt: string) {
    const trimedPrompt = prompt.trim();
    if (!trimedPrompt) {
      // TODO: handle error
      return;
    }

    if (generatedText.value) {
      messages.value = [
        ...messages.value,
        {
          role: "assistant",
          content: generatedText,
        },
      ];
    }
    messages.value = [
      ...messages.value,
      {
        role: "user",
        content: trimedPrompt,
      },
    ];

    loading.value = true;

    fetch("/api/prompt", {
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

        let text = "";
        while (true) {
          const { done, value } = await reader?.read();
          const str = decoder.decode(value);

          if (done || str === "[DONE]") {
            break;
          }

          if (!str.startsWith("data: ")) {
            continue;
          }

          try {
            const { response } = JSON.parse(str.slice(6));
            text += response;

            generatedText.value = text;
          } catch (e) {
            console.warn("Failed to parse JSON message", e);
          }
        }
      })
      .finally(function () {
        loading.value = false;
      });
  }

  return {
    loading,
    generatedText,
    sendPrompt,
  };
}
