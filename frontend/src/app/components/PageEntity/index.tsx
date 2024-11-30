"use client";

import {
  Box,
  Button,
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

export function PageEntity({ prevMessages }: { prevMessages: ChatMessage[] }) {
  const { usernameRef, messageRef, sendMessage, messages } = useHooks({
    prevMessages,
  });

  return (
    <Flex p="100px 50px 0 50px" gap="20px">
      <Box w="50%">
        <form onSubmit={sendMessage}>
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
  );
}
