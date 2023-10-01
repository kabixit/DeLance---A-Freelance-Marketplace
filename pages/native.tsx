import Home from './Home';
import Login from './Login';
import Register from './Register';
import React from 'react';
import {
  Flex,
  Heading,
  Input,
  Button,
  FormControl,
  FormLabel,
  Switch,
  useColorMode,
  useColorModeValue,
  Box,
} from '@chakra-ui/react';
import {
  ConnectWallet,
  Web3Button,
  useAddress,
  useContract,
  useContractRead,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { Card, CardBody, Container, SimpleGrid, Skeleton, Stack, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useState } from "react";

const Native: NextPage = () => {
  return (
    <Flex
      flexDirection={{ base: "column", md: "row" }}
      justifyContent="center"
      alignItems="center"
      p={4}
    >
      <Flex justifyContent="center" marginBottom="20px">
        <ConnectWallet theme='dark' />
      </Flex>
      <Flex flexDirection="column">
        <Box marginBottom="20px">
          <Register />
        </Box>
        <Box marginLeft={{ base: "0", md: "20px" }}>
          <Login />
        </Box>
      </Flex>
    </Flex>
  );
};

export default Native;
