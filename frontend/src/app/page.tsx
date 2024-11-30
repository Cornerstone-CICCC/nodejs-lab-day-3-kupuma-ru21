import { PageEntity } from "./components/PageEntity";
import { ChatMessage } from "./types";

export default async function Page() {
  const prevMessages = await (async () => {
    try {
      const response = await fetch("http://localhost:8080/api/chat");
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json: ChatMessage[] = await response.json();

      return json;
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Failed to fetch prevChats");
    }
  })();

  return <PageEntity prevMessages={prevMessages} />;
}
