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
import { ConnectWallet, Web3Button, useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { Card, CardBody, Container, SimpleGrid, Skeleton, Stack, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useState } from "react";

export default function App() {
  return (
    <>
    <Flex justifyContent="right" marginRight="20px" marginTop="20px">
      <ConnectWallet theme='dark' />
    </Flex>
    <Flex justifyContent="center">
      <Box marginRight="20px">
        <Register />
      </Box>
      <Box marginLeft="20px">
        <Login />
      </Box>
    </Flex>
    </>
  );
}
