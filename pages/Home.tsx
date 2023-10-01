import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Heading, Flex, Box, Text, Grid, GridItem, Spinner, Button, Avatar, VStack } from '@chakra-ui/react';
import { useAddress, useContract, useContractRead } from '@thirdweb-dev/react';
import JobsPage from './JobsPage';


const NavBar = () => {
  const address = useAddress();
  const { contract } = useContract('0xdccC139029dD82CbD35CF3873F43f91E7A6DA40a'); // Replace with your contract address
  const router = useRouter();

  const [userDetails, setUserDetails] = useState(null);

  const { data: user, isLoading, error } = useContractRead(contract, 'getUserByWallet', [address]);

  useEffect(() => {
    if (user) {
      const name = user[1];
      const email = user[2];
      const isFreelancer = user[3];

      setUserDetails({ name, email, isFreelancer });
    }
  }, [user]);

  const handleLogout = () => {
    // Perform logout logic here
    router.push('/');
  };

  const handleCreateJob = () => {
    // Redirect to create job page
    router.push('/CreateJob');
  };

  const handleSeeAllJobs = () => {
    // Redirect to create job page
    router.push('/JobsPage');
  };

  const handleYourJobs = () => {
    // Redirect to create job page
    router.push('/BuyerJobsPage');
  };

  
  const handleSeeYourProposals = () => {
    // Redirect to create job page
    router.push('/YourProposals');
  };

  const isFreelancer = user?.isFreelancer;

  if (isLoading) {
    return null; // You can display a loading state here if needed
  }

  return (
    <>
    <Flex
      bg="transparent"
      p={4}
      justifyContent="space-between"
      alignItems="center"
      color="white"
    >
      <Box ml={4} fontWeight="bold" fontSize={30}>
        DeLance
      </Box>
      <Flex alignItems="center">
        {address && (
          <>
            {/* User Profile */}
            
            {/* User Name */}
            <Text mr={4}>{user?.name}</Text>
          </>
        )}
        {userDetails && (
          <>
            {userDetails.isFreelancer ? (
            <Button
              bg="white"
              color="teal"
              onClick={handleSeeAllJobs}
              display="block"
              marginRight="10px"
            >
              See All Jobs
            </Button>
           ) : (
            <Button
              bg="white"
              color="teal"
              onClick={handleCreateJob}
              display="block"
              marginRight="10px"
            >
              Post a Job
            </Button>
             )}
          </>
        )}
        {userDetails && (
          <>
            {userDetails.isFreelancer ? (
            <Button
              bg="white"
              color="teal"
              onClick={handleSeeYourProposals}
              display="block"
              marginRight="10px"
            >
              Your Proposals
            </Button>
           ) : (
            <Button
            bg="white"
            color="teal"
            onClick={handleYourJobs}
            display={'block'}
            marginRight="10px">
            Your Jobs
            </Button>
             )}
          </>
        )}
        

        {/* Logout Button */}
        <Button
          bg="white"
          color="teal"
          onClick={handleLogout}
          display={address ? 'block' : 'none'}
        >
          Logout
        </Button>
      </Flex>
    </Flex>
    <VStack>
    <Box w="100%" py={12} textAlign="center">
    <Heading>Welcome to DeLanceApp</Heading>
    <Text mt={4}>
      Find the best freelance jobs, or post one. Start freelancing today!
    </Text>
    {userDetails && (
          <>
            {userDetails.isFreelancer ? (
            <Button
            colorScheme="teal"
              onClick={handleSeeYourProposals}
              mt={6}
            >
              Get Started
            </Button>
           ) : (
            <Button
            colorScheme="teal"
            onClick={handleYourJobs}
            mt={6}>     
            Get Started
            </Button>
             )}
          </>
        )}
  </Box>

  {/* Jobs Listings */}
  <JobsPage/>

  {/* Footer */}
  <Box w="100%" py={6} borderTopWidth="1px">
    <Text>© 2023 FreelanceApp. All rights reserved.</Text>
  </Box>
</VStack>
</>
  );
};

export default NavBar;
