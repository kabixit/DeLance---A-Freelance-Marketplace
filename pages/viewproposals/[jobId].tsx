import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, List, ListItem, Button, useColorModeValue } from '@chakra-ui/react';
import { ethers } from 'ethers';

const ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"JobCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"JobCompleted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"jobId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"string","name":"title","type":"string"}],"name":"JobPosted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"proposalId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"ProposalAccepted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"proposalId","type":"uint256"},{"indexed":true,"internalType":"address","name":"freelancer","type":"address"},{"indexed":true,"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"ProposalSubmitted","type":"event"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"acceptProposal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"cancelJob","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"completeJob","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"buyer","type":"address"}],"name":"getBuyerJobs","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"freelancer","type":"address"}],"name":"getFreelancerProposals","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"freelancer","type":"address"},{"internalType":"uint256","name":"jobId","type":"uint256"},{"internalType":"string","name":"coverLetter","type":"string"},{"internalType":"bool","name":"isAccepted","type":"bool"},{"internalType":"bool","name":"isCompleted","type":"bool"}],"internalType":"struct JobContract.Proposal[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getJobCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"getJobProposals","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"freelancer","type":"address"},{"internalType":"uint256","name":"jobId","type":"uint256"},{"internalType":"string","name":"coverLetter","type":"string"},{"internalType":"bool","name":"isAccepted","type":"bool"},{"internalType":"bool","name":"isCompleted","type":"bool"}],"internalType":"struct JobContract.Proposal[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getProposalCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"jobs","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"client","type":"address"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"string","name":"requiredSkills","type":"string"},{"internalType":"uint256","name":"paymentAmount","type":"uint256"},{"internalType":"bool","name":"isCompleted","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nextJobId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nextProposalId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"string","name":"requiredSkills","type":"string"},{"internalType":"uint256","name":"paymentAmount","type":"uint256"}],"name":"postJob","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"proposals","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"freelancer","type":"address"},{"internalType":"uint256","name":"jobId","type":"uint256"},{"internalType":"string","name":"coverLetter","type":"string"},{"internalType":"bool","name":"isAccepted","type":"bool"},{"internalType":"bool","name":"isCompleted","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"jobId","type":"uint256"},{"internalType":"string","name":"coverLetter","type":"string"}],"name":"submitProposal","outputs":[],"stateMutability":"nonpayable","type":"function"}];  // Same ABI as above
const contractAddress = "0x014bac51473AA5CeF772F82A07CC44BCe8D55C36";

const JobProposalsPage = () => {
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { jobId } = router.query;

  const loadJobProposals = async () => {
      if (!jobId) return; // Don't fetch if jobId is not available yet

      try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(contractAddress, ABI, signer);

          const jobProposals = await contract.getJobProposals(jobId);
          setProposals(jobProposals);

      } catch (error) {
          console.error("Error loading proposals for the job:", error);
      } finally {
          setIsLoading(false);
      }
  };

  useEffect(() => {
      loadJobProposals();
  }, [jobId]);

  const handleAcceptProposal = async (proposalId) => {
      try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(contractAddress, ABI, signer);
          await contract.acceptProposal(proposalId);
          loadJobProposals();
      } catch (error) {
          console.error("Error accepting proposal:", error);
      }
  };

    return (
      <Box p={8} bg={useColorModeValue('gray.100', 'gray.900')}>
      <Heading mb={4} color={useColorModeValue('gray.800', 'gray.200')}>
          Proposals for Job ID: {jobId}
      </Heading>
      {isLoading ? (
          <Text>Loading...</Text>
      ) : (
          <List spacing={3}>
              {proposals.map((proposal, idx) => (
                  <ListItem key={idx} p={4} bg={useColorModeValue('white', 'gray.800')} borderRadius="md">
                      <Text fontWeight="bold" color={useColorModeValue('gray.800', 'gray.200')}>
                          Freelancer: {proposal.freelancer}
                      </Text>
                      <Text color={useColorModeValue('gray.500', 'gray.400')}>
                          Cover Letter: {proposal.coverLetter}
                      </Text>
                      {proposal.isAccepted ? (
                          <Text mt={2} colorScheme="teal">
                              Accepted
                          </Text>
                      ) : (
                          <Button 
                              mt={2}
                              colorScheme="teal" 
                              onClick={() => handleAcceptProposal(proposal.id)}
                          >
                              Accept Proposal
                          </Button>
                      )}
                  </ListItem>
              ))}
          </List>
      )}
  </Box>
    );
};

export default JobProposalsPage;
