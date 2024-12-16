export const fetchModels = async (): Promise<string[]> => {
  const response = await fetch("http://localhost:11434/api/tags");
  const data = await response.json();
  return data.models.map((model: { model: string }) => model.model);
};

export const sendMessage = async (
  model: string,
  content: string,
  controller: AbortController
): Promise<string> => {
  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant. detect language and response ",
          lang: "en",
        },
        { role: "user", content },
      ],
      stream: false,
    }),
    signal: controller.signal, // Attach abort signal
  });

  const data = await response.json();
  return data.message.content;
};
