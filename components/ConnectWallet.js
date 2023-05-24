import styles from "../styles/components/ConnectWallet.module.css";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { useAccount, useConnect } from "wagmi";

export const ConnectWallet = () => {
  const connector = new MetaMaskConnector();
  const { connect, error, isLoading, pendingConnector } = useConnect();
  const { address } = useAccount({
    onConnect({ address }) {
      localStorage.setItem("connected", address);
    },

    onDisconnect({ address }) {
      localStorage.setItem("connected", ADDRESS_ZERO);
    },
  });

  return (
    <div className={styles.connectWallet}>
      <h3>Connect wallet</h3>
      <p>Connect wallet and get started!</p>
      <button onClick={() => connect({ connector })}>
        {isLoading || pendingConnector ? "..." : "Connect"}
      </button>
      {error && <p>Failed To Connect</p>}
    </div>
  );
};
