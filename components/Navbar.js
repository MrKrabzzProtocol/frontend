import { CHAIN_MAPPING, truncateAddr } from "@/utils";
import { useAccount, useNetwork } from "wagmi";
import styles from "../styles/components/Navbar.module.css";

export const Navbar = () => {
  const { address, isDisconnected, isConnected } = useAccount();
  const { chain, chains } = useNetwork();

  return (
    <div className={styles.navBar}>
      <div className={styles.start}>
        <img src="/logo.png" />
        <a href="/">Mr Krabz</a>
      </div>

      <div className={styles.middle}>
        <a
          href="/"
          style={{ marginRight: "30px", color: "#14d279", fontWeight: "bold" }}
        >
          Documentation &gt;
        </a>

        {isConnected && (
          <div>
            <p>
              Network: <span>{CHAIN_MAPPING[chain.id].name}</span>
            </p>
            <a href="/myAccount">My Account</a>
          </div>
        )}
      </div>

      <div className={styles.end}>
        {isDisconnected && <a href="/">Launch App</a>}

        <a
          href="/faucet"
          style={{ marginRight: "30px", color: "#ce0101", fontWeight: "bold" }}
        >
          Faucet
        </a>
        <a href="/">Participate</a>
        <p>{truncateAddr(address)}</p>
      </div>
    </div>
  );
};
