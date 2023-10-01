import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, Grid, GridItem, Button, useColorModeValue } from '@chakra-ui/react';
import { useContract, useContractWrite, useContractRead } from '@thirdweb-dev/react';
import { useRouter } from 'next/router';

const ProposalsPage = () => {
  const { contract: jobContract } = useContract('0x014bac51473AA5CeF772F82A07CC44BCe8D55C36'); // Replace with your contract address

  const [proposals, setProposals] = useState([]);
  const router = useRouter();

  const { data: proposalCount, isLoading, error } = useContractRead(jobContract, 'getProposalCount', []);
  const { send: acceptProposal } = useContractWrite(jobContract, 'acceptProposal');

  useEffect(() => {
    if (proposalCount) {
      fetchProposals(proposalCount);
    }
  }, [proposalCount]);

  const fetchProposals = async (count) => {
    const proposalPromises = [];

    for (let i = 0; i < count; i++) {
      proposalPromises.push(jobContract.call('proposals', [i]));
    }

    try {
      const proposalResults = await Promise.all(proposalPromises);
      const proposals = proposalResults.map((result, index) => {
        const [id, freelancer, jobId, coverLetter, isAccepted, isCompleted] = result;

        return {
          id,
          freelancer,
          jobId,
          coverLetter,
          isAccepted,
          isCompleted,
        };
      });

      setProposals(proposals);
    } catch (error) {
      console.error(error);
      setProposals([]);
    }
  };

  const handleAcceptProposal = async (proposalId) => {
    try {
      await acceptProposal(proposalId);
      // Proposal accepted successfully, perform any necessary actions
      // such as updating UI or navigating to a different page
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoBack = () => {
    router.push('/Home');
  };

  if (isLoading) {
    return <div>Loading proposals...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const boxBgColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.200');

  return (
    <Box p={8} bg={useColorModeValue('gray.100', 'gray.900')}>
      <Heading mb={4} color={useColorModeValue('gray.800', 'gray.200')}>
        Proposals
      </Heading>
      {proposals.length === 0 ? (
        <Text color={textColor}>No proposals available.</Text>
      ) : (
        <>
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            {proposals.map((proposal) => (
              <GridItem key={proposal.id}>
                <Box p={4} borderWidth={1} borderRadius="md" shadow="md" bg={boxBgColor}>
                  <Text mb={2} color={textColor}>
                    <strong>Job ID:</strong> {proposal.jobId}
                  </Text>
                  <Text mb={2} color={textColor}>
                    <strong>Freelancer:</strong> {proposal.freelancer}
                  </Text>
                  <Text mb={2} color={textColor}>
                    <strong>Cover Letter:</strong> {proposal.coverLetter}
                  </Text>
                  {proposal.isAccepted ? (
                    <Button colorScheme="teal" mt={4} disabled>
                      Accepted
                    </Button>
                  ) : (
                    <Button
                      colorScheme="teal"
                      mt={4}
                      onClick={() => handleAcceptProposal(proposal.id)}
                      _hover={{ bg: 'teal.500', color: 'white' }}
                      _focus={{ outline: 'none' }}
                    >
                      Accept Proposal
                    </Button>
                  )}
                </Box>
              </GridItem>
            ))}
          </Grid>
          <Button
            colorScheme="teal"
            mt={6}
            onClick={handleGoBack}
            _hover={{ bg: 'teal.500', color: 'white' }}
            _focus={{ outline: 'none' }}
          >
            Go to Home
          </Button>
        </>
      )}
    </Box>
  );
};

export default ProposalsPage;
