import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useAccount, useConnect, useNetwork } from "wagmi";
import { ConnectWallet } from "@/components/ConnectWallet";
import { Navbar } from "@/components/Navbar";
import { MyAccount } from "@/components/MyAccount";
import { Lotto } from "@/components/Lotto";
import { useEffect } from "react";

import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { ADDRESS_ZERO } from "@/utils";

export default function Home() {
  const { chain, chains } = useNetwork();
  const { isConnected } = useAccount();

  const connector = new MetaMaskConnector();
  const { connect } = useConnect();

  useEffect(() => {
    let connected = localStorage.getItem("connected");
    console.log("CNCTD", connected);
    if (connected != ADDRESS_ZERO) connect({ connector });
  }, []);

  return (
    <>
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
              <div className={styles.top}>
                <Navbar />
              </div>

              {/* CONETENT BELOW */}
              <div className={styles.bottom}>
                <Lotto />
              </div>
            </div>
          ) : (
            <ConnectWallet />
          )}
        </main>
      </>
    </>
  );
}
