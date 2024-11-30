import { FormEvent, useEffect, useRef, useState } from "react";
import { socket } from "../../../socket";
import { Chat } from "@/app/types";

export function useHooks({ prevChats }: { prevChats: Chat[] }) {
  // NOTE: show Socket connection status
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  console.log(`Status: ${isConnected ? "connected" : "disconnected"}`);
  console.log(`Transport: ${transport}`);

  // NOTE: send username and message to server
  const usernameRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = usernameRef.current?.value;
    const message = messageRef.current?.value;
    if (!username || !message) return;
    socket.emit("sendMessage", { username, message });
    usernameRef.current.value = "";
    messageRef.current.value = "";
  };

  // NOTE: get chat messages from server
  const [messages, setMessages] = useState<Chat[]>(prevChats);
  useEffect(() => {
    socket.on("newMessage", (data) => {
      console.log("data:", data);
      setMessages((prev) => [...prev, data]);
    });
    return () => {
      socket.off("newMessage");
    };
  }, []);

  return { usernameRef, messageRef, sendMessage, messages };
}
