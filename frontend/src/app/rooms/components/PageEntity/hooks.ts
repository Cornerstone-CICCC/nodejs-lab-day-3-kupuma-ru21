import { FormEvent, useEffect, useRef, useState } from "react";
import { socket } from "@/socket";
import { ChatMessage } from "@/app/types";
import { useRouter } from "next/navigation";

export function useHooks({
  prevChats,
  defaultRoom,
}: {
  prevChats: ChatMessage[];
  defaultRoom: string;
}) {
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

  // NOTE: select room
  const [room, setRoom] = useState(defaultRoom);
  const router = useRouter();
  const selectRoom = (newRoom: string) => {
    console.log("room:", room);

    socket.emit("leaveRoom", { room });
    socket.emit("joinRoom", { room: newRoom });
    setRoom(newRoom);
    router.push(`/rooms?room=${newRoom}`);
  };

  // NOTE: send username and message to server
  const usernameRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = usernameRef.current?.value;
    const message = messageRef.current?.value;
    if (!username || !message) return;
    socket.emit("sendMessageByRoom", { username, message, room });
    usernameRef.current.value = "";
    messageRef.current.value = "";
  };

  // NOTE: get chat messages from server
  const [messages, setMessages] = useState<ChatMessage[]>(prevChats);
  useEffect(() => {
    socket.on("newMessageByRoom", (data) => {
      console.log("data:", data);
      setMessages((prev) => [...prev, data]);
    });
    return () => {
      socket.off("newMessageByRoom");
    };
  }, []);

  const leaveRoom = () => {
    socket.emit("leaveRoom", { room });
    setRoom("");
    router.push(`/rooms`);
  };

  return {
    selectRoom,
    sendMessage,
    usernameRef,
    messageRef,
    messages,
    leaveRoom,
  };
}
