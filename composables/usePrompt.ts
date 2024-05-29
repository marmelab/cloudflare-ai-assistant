type Prompt = {
  role: "user" | "assistant";
  content: string;
};

export default function usePrompt() {
  // public API
  const messages = ref<Prompt[]>([]);
  const loading = ref<boolean>(false);

  function sendPrompt(prompt: string) {
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



        let content = "";
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
            content += response;

            messages.value = [
              ...currentMessages,
              {
                role: "assistant",
                content,
              },
            ];
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
    messages,
    sendPrompt,
  };
}
