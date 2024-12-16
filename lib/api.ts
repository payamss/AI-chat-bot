export const fetchModels = async (): Promise<string[]> => {
  const response = await fetch("http://localhost:11434/api/tags");
  const data = await response.json();
  return data.models.map((model: { model: string }) => model.model);
};

export const sendMessage = async (
  model: string,
  messages: { role: string; content: string }[], // Pass chat history here
  controller: AbortController
): Promise<string> => {
  try {
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: messages, // Send full chat history
        stream: false,
      }),
      signal: controller.signal, // Allow aborting the request
    });

    const data = await response.json();
    return data.message.content; // Return the assistant's response
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
