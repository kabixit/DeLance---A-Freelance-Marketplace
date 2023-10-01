import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Heading, Flex, Box, Text, Grid, GridItem, Spinner, Button } from '@chakra-ui/react';
import { ethers } from 'ethers';

const ProfilePage = () => {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  
  const contractAddress = '0x0F598A42b992AB1F7D0DE97731C403c180ed7F3d'; // Replace with your contract address
  const ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"wallet","type":"address"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"string","name":"email","type":"string"},{"indexed":false,"internalType":"bool","name":"isFreelancer","type":"bool"}],"name":"UserLoggedIn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"wallet","type":"address"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"string","name":"email","type":"string"},{"indexed":false,"internalType":"bool","name":"isFreelancer","type":"bool"}],"name":"UserRegistered","type":"event"},{"inputs":[{"internalType":"string","name":"email","type":"string"}],"name":"getUserByEmail","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"wallet","type":"address"}],"name":"getUserByWallet","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"password","type":"string"}],"name":"login","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"password","type":"string"},{"internalType":"bool","name":"isFreelancer","type":"bool"}],"name":"registerUser","outputs":[],"stateMutability":"nonpayable","type":"function"}]; // TODO: Insert your contract's ABI here
  
  useEffect(() => {
    async function fetchUserDetails() {
      try {
        // Create a new provider instance
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, ABI, signer);

        // Fetch the user's Ethereum address
        const address = await signer.getAddress();
        
        // Get user details from the contract
        const user = await contract.getUserByWallet(address);

        setUserDetails({
          name: user[1],
          email: user[2],
          isFreelancer: user[3]
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    router.push('/');
  };

  const handleHome = () => {
    router.push('/Home');
  };

  if (loading) {
    return (
      <Flex h="100vh" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="teal" />
      </Flex>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Flex h="100vh" alignItems="center" justifyContent="center">
      <Box p={8} borderWidth={1} borderRadius="lg" shadow="xl" position="relative">
        {userDetails && (
          <>
            {userDetails.isFreelancer ? (
              <Box
                position="absolute"
                top={2}
                right={2}
                bg="teal"
                color="white"
                px={2}
                py={1}
                borderRadius="md"
              >
                Freelancer
              </Box>
            ) : (
              <Box
                position="absolute"
                top={2}
                right={2}
                bg="teal"
                color="white"
                px={2}
                py={1}
                borderRadius="md"
              >
                Buyer
              </Box>
            )}
            <Heading mb={4} color="teal">
              Profile
            </Heading>
            <Grid templateColumns="1fr" gap={4}>
              <GridItem>
                <Text><strong>Name:</strong> {userDetails.name}</Text>
                <Text><strong>Email:</strong> {userDetails.email}</Text>
              </GridItem>
            </Grid>
            <Flex mt={6} justifyContent="space-between">
              <Button bg="teal" color="white" onClick={handleLogout}>Logout</Button>
              <Button bg="teal" color="white" onClick={handleHome}>Home</Button>
            </Flex>
          </>
        )}
      </Box>
    </Flex>
  );
};

export default ProfilePage;
