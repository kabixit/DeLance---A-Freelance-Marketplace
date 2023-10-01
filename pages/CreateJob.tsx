import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Textarea,
  NumberInput,
  NumberInputField,
  useToast,
} from '@chakra-ui/react';

const PostJob = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [signer, setSigner] = useState(null);
  const [jobContract, setJobContract] = useState(null);

  const toast = useToast();
  const contractAddress = "0x014bac51473AA5CeF772F82A07CC44BCe8D55C36";
  const ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"JobCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"JobCompleted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"jobId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"string","name":"title","type":"string"}],"name":"JobPosted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"proposalId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"ProposalAccepted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"proposalId","type":"uint256"},{"indexed":true,"internalType":"address","name":"freelancer","type":"address"},{"indexed":true,"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"ProposalSubmitted","type":"event"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"acceptProposal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"cancelJob","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"completeJob","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"buyer","type":"address"}],"name":"getBuyerJobs","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"freelancer","type":"address"}],"name":"getFreelancerProposals","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"freelancer","type":"address"},{"internalType":"uint256","name":"jobId","type":"uint256"},{"internalType":"string","name":"coverLetter","type":"string"},{"internalType":"bool","name":"isAccepted","type":"bool"},{"internalType":"bool","name":"isCompleted","type":"bool"}],"internalType":"struct JobContract.Proposal[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getJobCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"getJobProposals","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"freelancer","type":"address"},{"internalType":"uint256","name":"jobId","type":"uint256"},{"internalType":"string","name":"coverLetter","type":"string"},{"internalType":"bool","name":"isAccepted","type":"bool"},{"internalType":"bool","name":"isCompleted","type":"bool"}],"internalType":"struct JobContract.Proposal[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getProposalCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"jobs","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"client","type":"address"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"string","name":"requiredSkills","type":"string"},{"internalType":"uint256","name":"paymentAmount","type":"uint256"},{"internalType":"bool","name":"isCompleted","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nextJobId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nextProposalId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"string","name":"requiredSkills","type":"string"},{"internalType":"uint256","name":"paymentAmount","type":"uint256"}],"name":"postJob","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"proposals","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"freelancer","type":"address"},{"internalType":"uint256","name":"jobId","type":"uint256"},{"internalType":"string","name":"coverLetter","type":"string"},{"internalType":"bool","name":"isAccepted","type":"bool"},{"internalType":"bool","name":"isCompleted","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"jobId","type":"uint256"},{"internalType":"string","name":"coverLetter","type":"string"}],"name":"submitProposal","outputs":[],"stateMutability":"nonpayable","type":"function"}];  // Put your contract ABI here

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setSigner(provider.getSigner());
      const contractInstance = new ethers.Contract(contractAddress, ABI, provider);
      setJobContract(contractInstance);
    }
  }, []);

  const handlePostJob = async () => {
    try {
      if (!jobContract || !signer) {
        throw new Error('Contract or signer not initialized');
      }

      const contractWithSigner = jobContract.connect(signer);
      const tx = await contractWithSigner.postJob(title, description, requiredSkills, paymentAmount);
      await tx.wait();

      toast({
        title: 'Job Posted',
        description: 'Your job has been posted successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      setTitle('');
      setDescription('');
      setRequiredSkills('');
      setPaymentAmount(0);

    } catch (error) {
      console.error('Failed to post job:', error);

      toast({
        title: 'Error',
        description: 'Failed to post the job.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6}>
      <Heading mb={4}>Post a Job</Heading>

      <FormControl id="title" mb={4}>
        <FormLabel>Job Title</FormLabel>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </FormControl>

      <FormControl id="description" mb={4}>
        <FormLabel>Job Description</FormLabel>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </FormControl>

      <FormControl id="skills" mb={4}>
        <FormLabel>Required Skills</FormLabel>
        <Input value={requiredSkills} onChange={(e) => setRequiredSkills(e.target.value)} />
      </FormControl>

      <FormControl id="payment" mb={4}>
        <FormLabel>Payment Amount (ETH)</FormLabel>
        <NumberInput min={0} value={paymentAmount} onChange={(value) => setPaymentAmount(value)}>
          <NumberInputField />
        </NumberInput>
      </FormControl>

      <Button colorScheme="teal" onClick={handlePostJob}>
        Post Job
      </Button>
    </Box>
  );
};

export default PostJob;
