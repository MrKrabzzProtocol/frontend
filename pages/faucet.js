import Head from "next/head";
import styles from "@/styles/Home.module.css";
import {
  useAccount,
  useConnect,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi";
import { ConnectWallet } from "@/components/ConnectWallet";
import { Navbar } from "@/components/Navbar";
import { useEffect, useState } from "react";
import { KRABZ_TOKEN_ABI } from "@/abi";
import { ADDRESS_ZERO, KRABZ } from "@/utils";
import { parseEther } from "viem";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

export default function Faucet() {
  const { chain } = useNetwork();
  const { isConnected } = useAccount();
  const connector = new MetaMaskConnector();
  const { connect } = useConnect();

  const [amount, setAmount] = useState();
  const [recipient, setRecipient] = useState();

  // APPROVE
  const { config: mintKrabzConfig } = usePrepareContractWrite({
    address: chain && KRABZ.contractAddress[chain.id],
    abi: KRABZ_TOKEN_ABI,
    functionName: "mintKrabz",
    args: [recipient, amount],
  });

  const { write: mintKrabz } = useContractWrite({
    ...mintKrabzConfig,
    onSuccess() {
      console.log("Approved!");
    },
  });

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
                <div className={styles.faucet}>
                  <img src="/faucet.jpg" />
                  <h3>Krabz Token Fauect</h3>
                  <input
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Address"
                  />
                  <input
                    onChange={(e) =>
                      setAmount(parseEther(e.target.value).toString())
                    }
                    placeholder="Amount"
                  />

                  <button disabled={!mintKrabz} onClick={() => mintKrabz()}>
                    Mint
                  </button>
                </div>
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
