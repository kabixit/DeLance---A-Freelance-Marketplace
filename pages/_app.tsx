import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ChakraProvider } from "@chakra-ui/react";
import "../styles/globals.css";
import { Sepolia } from "@thirdweb-dev/chains";
import { QueryClientProvider } from "react-query";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = {Sepolia};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider activeChain={Sepolia} clientId="ade3321413ba710905cee379445e342d">
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;
