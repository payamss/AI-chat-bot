const DEFAULT_URL = process.env.NEXT_PUBLIC_OLLAMA_URL || "http://localhost:11434";

export const fetchModels = async (
  baseURL: string = DEFAULT_URL
): Promise<string[]> => {
  const response = await fetch(`${baseURL}/api/tags`);
  const data = await response.json();
  return data.models.map((model: { model: string }) => model.model);
};

export const sendMessage = async (
  model: string,
  messages: { role: string; content: string }[],
  controller: AbortController,
  baseURL: string = DEFAULT_URL
): Promise<{
  content: string;
  model: string;
  total_duration: number;
}> => {
  try {
    const response = await fetch(`${baseURL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.message.content,
      model: data.model,
      total_duration: data.total_duration,
    };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
