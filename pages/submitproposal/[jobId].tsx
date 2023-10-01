import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Heading, Text, Button, FormControl, FormLabel, Textarea, Spinner } from '@chakra-ui/react';
import { ethers } from 'ethers';

const ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"JobCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"JobCompleted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"jobId","type":"uint256"},{"indexed":true,"internalType":"address","name":"client","type":"address"},{"indexed":false,"internalType":"string","name":"title","type":"string"}],"name":"JobPosted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"proposalId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"ProposalAccepted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"proposalId","type":"uint256"},{"indexed":true,"internalType":"address","name":"freelancer","type":"address"},{"indexed":true,"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"ProposalSubmitted","type":"event"},{"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"acceptProposal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"cancelJob","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"completeJob","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"buyer","type":"address"}],"name":"getBuyerJobs","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"freelancer","type":"address"}],"name":"getFreelancerProposals","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"freelancer","type":"address"},{"internalType":"uint256","name":"jobId","type":"uint256"},{"internalType":"string","name":"coverLetter","type":"string"},{"internalType":"bool","name":"isAccepted","type":"bool"},{"internalType":"bool","name":"isCompleted","type":"bool"}],"internalType":"struct JobContract.Proposal[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getJobCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"jobId","type":"uint256"}],"name":"getJobProposals","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"freelancer","type":"address"},{"internalType":"uint256","name":"jobId","type":"uint256"},{"internalType":"string","name":"coverLetter","type":"string"},{"internalType":"bool","name":"isAccepted","type":"bool"},{"internalType":"bool","name":"isCompleted","type":"bool"}],"internalType":"struct JobContract.Proposal[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getProposalCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"jobs","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"client","type":"address"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"string","name":"requiredSkills","type":"string"},{"internalType":"uint256","name":"paymentAmount","type":"uint256"},{"internalType":"bool","name":"isCompleted","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nextJobId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nextProposalId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"string","name":"requiredSkills","type":"string"},{"internalType":"uint256","name":"paymentAmount","type":"uint256"}],"name":"postJob","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"proposals","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"freelancer","type":"address"},{"internalType":"uint256","name":"jobId","type":"uint256"},{"internalType":"string","name":"coverLetter","type":"string"},{"internalType":"bool","name":"isAccepted","type":"bool"},{"internalType":"bool","name":"isCompleted","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"jobId","type":"uint256"},{"internalType":"string","name":"coverLetter","type":"string"}],"name":"submitProposal","outputs":[],"stateMutability":"nonpayable","type":"function"}];  // Insert your contract ABI here

const SubmitProposal = () => {
  const router = useRouter();
  const { jobId } = router.query;
  const jobIdNumber = Number(jobId);

  const [provider, setProvider] = useState(null);
  const [jobContract, setJobContract] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const providerInstance = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(providerInstance);
      const contractInstance = new ethers.Contract('0x014bac51473AA5CeF772F82A07CC44BCe8D55C36', ABI, providerInstance);
      setJobContract(contractInstance);
    }
  }, []);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const result = await jobContract.jobs(jobIdNumber);
        setJobDetails({
          id: result.id.toNumber(),
          client: result.client,
          title: result.title,
          description: result.description,
          requiredSkills: result.requiredSkills,
          paymentAmount: ethers.utils.formatEther(result.paymentAmount),
          isCompleted: result.isCompleted,
        });
      } catch (error) {
        console.error(error);
      }
    };

    if (jobContract) {
      fetchJobDetails();
    }
  }, [jobContract, jobIdNumber]);

  const handleCoverLetterChange = (event) => {
    setCoverLetter(event.target.value);
  };

  const handleSubmitProposal = async () => {
    if (!provider) return;

    const signer = provider.getSigner();
    const contractWithSigner = jobContract.connect(signer);

    try {
      setIsLoading(true);
      await contractWithSigner.submitProposal(jobIdNumber, coverLetter);
      setIsLoading(false);
      router.push('/JobsPage'); // Navigate back to the jobs page after submitting the proposal
    } catch (error) {
      setError(error);
      setIsLoading(false);
      console.error(error);
    }
  };

  return (
    <Box p={8}>
      <Heading mb={4}>Submit Proposal</Heading>
      {jobDetails ? (
        <>
          <Box borderWidth={1} p={4} borderRadius="md" mb={4}>
            <Heading as="h3" size="md" mb={2}>
              {jobDetails.title}
            </Heading>
            <Text mb={2}>{jobDetails.description}</Text>
            <Text>
              <strong>Skills Required:</strong> {jobDetails.requiredSkills}
            </Text>
            <Text>
              <strong>Payment Amount:</strong> {jobDetails.paymentAmount} ETH
            </Text>
          </Box>
          <FormControl mb={4}>
            <FormLabel>Cover Letter</FormLabel>
            <Textarea value={coverLetter} onChange={handleCoverLetterChange} placeholder="Enter your cover letter" />
          </FormControl>
          <Button colorScheme="teal" isLoading={isLoading} onClick={handleSubmitProposal}>
            {isLoading ? <Spinner size="sm" color="white" /> : 'Submit'}
          </Button>
          {error && <Text color="red">{error.message}</Text>}
        </>
      ) : (
        <Spinner />
      )}
    </Box>
  );
};

export default SubmitProposal;
