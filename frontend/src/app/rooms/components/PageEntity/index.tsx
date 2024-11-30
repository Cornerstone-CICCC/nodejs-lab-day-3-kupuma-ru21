"use client";

import {
  ButtonGroup,
  Button,
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  ListItem,
  Textarea,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { useHooks } from "./hooks";
import { ChatMessage } from "@/app/types";

export function PageEntity({
  prevChats,
  room,
}: {
  prevChats: ChatMessage[];
  room: string;
}) {
  const {
    selectRoom,
    sendMessage,
    usernameRef,
    messageRef,
    messages,
    leaveRoom,
  } = useHooks({ prevChats, defaultRoom: room });
  return (
    <Box p="50px 0 0 50px">
      <ButtonGroup variant="outline" spacing="6">
        {["room1", "room2", "room3"].map((v) => {
          return (
            <Button onClick={() => selectRoom(v)} colorScheme="blue" key={v}>
              {v}
            </Button>
          );
        })}
        <Button onClick={leaveRoom} colorScheme="blue">
          Leave Room
        </Button>
      </ButtonGroup>
      <Flex p="100px 50px 0 50px" gap="20px">
        <Box w="50%">
          <form onSubmit={sendMessage}>
            <fieldset disabled={room === ""}>
              <VStack spacing="20px">
                <FormControl>
                  <FormLabel>username</FormLabel>
                  <Input ref={usernameRef} />
                </FormControl>
                <FormControl>
                  <FormLabel>message</FormLabel>
                  <Textarea ref={messageRef} minH="200px" />
                </FormControl>
                <Button type="submit" colorScheme="teal">
                  Submit
                </Button>
              </VStack>
            </fieldset>
          </form>
        </Box>
        <Box w="50%">
          <UnorderedList>
            {messages.map(({ message, username, _id }) => {
              return <ListItem key={_id}>{`${username}:${message}`}</ListItem>;
            })}
          </UnorderedList>
        </Box>
      </Flex>
    </Box>
  );
}
