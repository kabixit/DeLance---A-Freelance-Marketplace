import Home from './Home';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Flex, Heading, Input, FormControl,
  FormLabel, Switch, useColorMode, useColorModeValue, Button,
} from '@chakra-ui/react';
import { ethers } from "ethers";

function Login() {
  const { toggleColorMode } = useColorMode();
  const formBackground = useColorModeValue('gray.100', 'gray.700');
  
  const contractAddress = "0x0F598A42b992AB1F7D0DE97731C403c180ed7F3d"; // Replace with your contract address
  const ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"wallet","type":"address"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"string","name":"email","type":"string"},{"indexed":false,"internalType":"bool","name":"isFreelancer","type":"bool"}],"name":"UserLoggedIn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"wallet","type":"address"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"string","name":"email","type":"string"},{"indexed":false,"internalType":"bool","name":"isFreelancer","type":"bool"}],"name":"UserRegistered","type":"event"},{"inputs":[{"internalType":"string","name":"email","type":"string"}],"name":"getUserByEmail","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"wallet","type":"address"}],"name":"getUserByWallet","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"password","type":"string"}],"name":"login","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"password","type":"string"},{"internalType":"bool","name":"isFreelancer","type":"bool"}],"name":"registerUser","outputs":[],"stateMutability":"nonpayable","type":"function"}]; // TODO: Insert your contract's ABI here

  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (window.ethereum) {
      const providerInstance = new ethers.providers.Web3Provider(window.ethereum);
      const contractInstance = new ethers.Contract(contractAddress, ABI, providerInstance.getSigner());
      setProvider(providerInstance);
      setContract(contractInstance);
    } else {
      console.error('Please install a web3 provider, like MetaMask');
    }
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      if (!contract) {
        throw new Error('Contract is not available');
      }

      // Assuming login returns a boolean indicating success
      const isLoggedIn = await contract.login(email, password);

      if (isLoggedIn) {
        console.log("Login successful");
        router.push('./Profile');
      } else {
        console.log("Login failed");
      }

    } catch (error) {
      console.error('Login error:', error);
    }
  }

  return (
    <Flex h="100vh" alignItems="center" justifyContent="center">
      <Flex
        flexDirection="column"
        bg={formBackground}
        p={12}
        borderRadius={8}
        boxShadow="lg"
      >
        <Heading mb={10}>Log In</Heading>
        <Input
          placeholder="johndoe@gmail.com"
          type="email"
          variant="filled"
          mb={3}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="**"
          type="password"
          variant="filled"
          mb={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button colorScheme="teal" onClick={handleLogin}>Log In</Button>
        <FormControl display="flex" marginTop={10} alignItems="center">
          <FormLabel htmlFor="dark_mode" mb="0">
            Enable Light Mode?
          </FormLabel>
          <Switch
            id="dark_mode"
            colorScheme="teal"
            size="lg"
            onChange={toggleColorMode}
          />
        </FormControl>
      </Flex>
    </Flex>
  );
}

export default Login;
