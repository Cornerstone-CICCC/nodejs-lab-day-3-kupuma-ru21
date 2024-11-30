import { Chat } from "../types";
import { PageEntity } from "./components/PageEntity";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ room: string | undefined }>;
}) {
  const { room } = await searchParams;
  const prevChats = await (async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/chat/${room}`);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json: Chat[] = await response.json();

      return json;
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Failed to fetch prevChats");
    }
  })();
  return (
    <PageEntity prevChats={prevChats} room={room ?? ""} key={room ?? ""} />
  );
}
