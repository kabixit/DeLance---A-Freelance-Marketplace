import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Flex, Heading, Input, Button, FormControl,
  FormLabel, useColorMode, useColorModeValue,
  RadioGroup, Stack, Radio, Box,
} from '@chakra-ui/react';
import { Container } from "@chakra-ui/react";
import { ThirdWeb } from 'thirdweb'; // Import ThirdWeb library

const Register = () => {
  const router = useRouter();
  const { toggleColorMode } = useColorMode();
  const formBackground = useColorModeValue('gray.100', 'gray.700');

  const contractAddress = "0x0F598A42b992AB1F7D0DE97731C403c180ed7F3d";
  const contractABI = [
    // ... (your contract ABI here)
  ];

  const [thirdWeb, setThirdWeb] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    // Initialize ThirdWeb and connect to a provider (e.g., MetaMask)
    async function initThirdWeb() {
      try {
        const tw = new ThirdWeb();
        await tw.init();
        const contractInstance = tw.getContract(contractAddress, contractABI);
        setThirdWeb(tw);
        setContract(contractInstance);
      } catch (error) {
        console.error('Failed to initialize ThirdWeb:', error);
      }
    }

    initThirdWeb();
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFreelancer, setIsFreelancer] = useState(false);

  const handleRegistration = async () => {
    try {
      if (!contract) {
        throw new Error('Contract is not available');
      }

      // Perform registration logic
      const tx = await contract.methods.registerUser(name, email, password, isFreelancer).send({ from: thirdWeb.getAccount() });
      await tx.wait(); // Wait for the transaction to be mined

      // Registration successful, navigate to the logged-in home page
      router.push('/home');
    } catch (error) {
      // Handle registration error
      console.error('Registration error:', error);
    }
  };

  return (
    <Container maxW={"1200px"} w={"full"}>
      <Flex h="100vh" alignItems="center" justifyContent="center">
        <Flex
          flexDirection="column"
          bg={formBackground}
          p={12}
          borderRadius={8}
          boxShadow="lg"
        >
          <Heading mb={5}>Register</Heading>
          <Input
            placeholder="Name"
            variant="filled"
            mb={3}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Email"
            type="email"
            variant="filled"
            mb={3}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            variant="filled"
            mb={3}
            onChange={(e) => setPassword(e.target.value)}
          />
          <RadioGroup value={isFreelancer ? "0" : "1"} onChange={(value) => setIsFreelancer(value === "0")}>
            <Stack direction="row" spacing={4} mb={6}>
              <Radio value="0">Freelancer</Radio>
              <Radio value="1">Buyer</Radio>
            </Stack>
          </RadioGroup>
          <Button colorScheme="teal" onClick={handleRegistration}>Register</Button>
        </Flex>
      </Flex>
    </Container>
  );
};

export default Register;
