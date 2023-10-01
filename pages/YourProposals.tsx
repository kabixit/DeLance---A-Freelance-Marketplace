import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  SimpleGrid,
} from '@chakra-ui/react';
import { ethers } from 'ethers';

const contractAddress = "0x014bac51473AA5CeF772F82A07CC44BCe8D55C36";
const ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"JobCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"JobCompleted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"jobId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"string","name":"title","type":"string"}],"name":"JobPosted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"proposalId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"ProposalAccepted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"proposalId","type":"uint256"},{"indexed":true,"internalType":"address","name":"freelancer","type":"address"},{"indexed":true,"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"ProposalSubmitted","type":"event"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"acceptProposal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"cancelJob","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"completeJob","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"buyer","type":"address"}],"name":"getBuyerJobs","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"freelancer","type":"address"}],"name":"getFreelancerProposals","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"freelancer","type":"address"},{"internalType":"uint256","name":"jobId","type":"uint256"},{"internalType":"string","name":"coverLetter","type":"string"},{"internalType":"bool","name":"isAccepted","type":"bool"},{"internalType":"bool","name":"isCompleted","type":"bool"}],"internalType":"struct JobContract.Proposal[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getJobCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"getJobProposals","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"freelancer","type":"address"},{"internalType":"uint256","name":"jobId","type":"uint256"},{"internalType":"string","name":"coverLetter","type":"string"},{"internalType":"bool","name":"isAccepted","type":"bool"},{"internalType":"bool","name":"isCompleted","type":"bool"}],"internalType":"struct JobContract.Proposal[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getProposalCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"jobs","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"client","type":"address"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"string","name":"requiredSkills","type":"string"},{"internalType":"uint256","name":"paymentAmount","type":"uint256"},{"internalType":"bool","name":"isCompleted","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nextJobId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nextProposalId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"string","name":"requiredSkills","type":"string"},{"internalType":"uint256","name":"paymentAmount","type":"uint256"}],"name":"postJob","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"proposals","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"freelancer","type":"address"},{"internalType":"uint256","name":"jobId","type":"uint256"},{"internalType":"string","name":"coverLetter","type":"string"},{"internalType":"bool","name":"isAccepted","type":"bool"},{"internalType":"bool","name":"isCompleted","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"jobId","type":"uint256"},{"internalType":"string","name":"coverLetter","type":"string"}],"name":"submitProposal","outputs":[],"stateMutability":"nonpayable","type":"function"}]; // Insert your contract ABI here

const MyJobProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUserProposals() {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();

        const contract = new ethers.Contract(contractAddress, ABI, signer);
        const userProposals = await contract.getFreelancerProposals(userAddress);
        
        setProposals(userProposals);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }

    loadUserProposals();
  }, []);

  return (
    <Box p={6}>
      <Heading mb={6}>My Job Proposals</Heading>

      {loading && <Text>Loading...</Text>}

      {error && <Text>Error fetching proposals: {error.message}</Text>}

      {!loading && !error && (
        <SimpleGrid columns={3} spacing={10}>
          {proposals.map((proposal, index) => (
            <Box key={index} borderWidth="1px" borderRadius="lg" p={4} boxShadow="md">
              <VStack spacing={3} align="start">
              <Heading size="md">Proposal for Job ID: {ethers.utils.formatUnits(proposal.jobId, 0)}</Heading>

                <Text>Cover Letter: {proposal.coverLetter}</Text>
                <Text>Accepted: {proposal.isAccepted ? "Yes" : "No"}</Text>
                <Text>Completed: {proposal.isCompleted ? "Yes" : "No"}</Text>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}

export default MyJobProposals;
