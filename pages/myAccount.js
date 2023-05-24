import Head from "next/head";
import {
  useAccount,
  useConnect,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi";
import { ConnectWallet } from "@/components/ConnectWallet";
import { Navbar } from "@/components/Navbar";
import { MyAccount } from "@/components/MyAccount";
import { useEffect } from "react";

import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { ADDRESS_ZERO } from "@/utils";

export default function MyAcct() {
  const { chain, chains } = useNetwork();
  const { isConnected } = useAccount();

  const connector = new MetaMaskConnector();
  const { connect } = useConnect();

  useEffect(() => {
    let connected = localStorage.getItem("connected");
    console.log("CNCTD", connected);
    if (connected != ADDRESS_ZERO) connect({ connector });
  }, []);

  console.log("chain", chain);
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Mr Krabz Lotto" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <main>
        {isConnected ? (
          <div>
            {/* NAVBAR */}
            <div>
              <Navbar />
            </div>

            {/* CONETENT BELOW */}
            <div>
              <MyAccount />
            </div>
          </div>
        ) : (
          <ConnectWallet />
        )}
      </main>
    </>
  );
}
