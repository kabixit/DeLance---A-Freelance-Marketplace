import React, { useState } from 'react';
import {
    Box,
    Input,
    Button,
    VStack,
    Heading,
    Textarea,
    Flex,
    Spacer,
    Text,
} from "@chakra-ui/react";

const ChatUI = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const sendMessage = () => {
        if (message.trim()) {
            setMessages([...messages, message]);
            setMessage('');
        }
    };

    return (
        <VStack spacing={4} p={6} w="500px" bg="gray.50" borderRadius="md" boxShadow="md">
            <Heading as="h4" size="md">Chakra Chat</Heading>
            <Box flex="1" bg="white" p={4} w="full" borderRadius="md" boxShadow="inner" overflowY="auto">
                {messages.map((msg, idx) => (
                    <Flex key={idx} mb={2}>
                        <Text fontWeight="bold" mr={2}>You:</Text>
                        <Text>{msg}</Text>
                    </Flex>
                ))}
            </Box>
            <Flex w="full">
                <Textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Type your message"
                />
                <Spacer />
                <Button ml={4} colorScheme="teal" onClick={sendMessage}>
                    Send
                </Button>
            </Flex>
        </VStack>
    );
};

export default ChatUI;
