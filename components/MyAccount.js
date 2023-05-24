import {
  usePrepareContractWrite,
  useNetwork,
  useContractWrite,
  erc20ABI,
  useAccount,
  useContractRead,
} from "wagmi";
import styles from "../styles/components/MyAccount.module.css";
import { CHAIN_MAPPING, FVM_CHAIN_ID, KRABZ, POLYGON_CHAIN_ID } from "@/utils";
import { MR_KRABZ_ABI } from "@/abi";
import { useState } from "react";
import { parseEther } from "viem";
import { ethers } from "ethers";

export const MyAccount = () => {
  const [topUpWalletAmount, setTopUpWalletAmount] = useState();
  const [topUpWalletNativeAsset, setTopUpWalletNativeAsset] = useState();
  const [assettype, setAssetType] = useState();

  const [withdrawWalletAmount, setWithdrawWalletAmount] = useState();
  const [withdrawWalletNativeAsset, setwithdrawWalletNativeAsset] = useState();

  const { chain } = useNetwork();
  const { address } = useAccount();

  let contractAddress;
  let estimatedGasAmount;
  if (chain.id == POLYGON_CHAIN_ID) {
    contractAddress = CHAIN_MAPPING[POLYGON_CHAIN_ID].contractAddress;
    estimatedGasAmount = parseEther("0.2").toString();
  }
  if (chain.id == FVM_CHAIN_ID) {
    contractAddress = CHAIN_MAPPING[FVM_CHAIN_ID].contractAddress;
    estimatedGasAmount = parseEther("0.3").toString();
  }

  // TOP UP WALLET
  const { config: topUpWalletConfig } = usePrepareContractWrite({
    address: contractAddress,
    abi: MR_KRABZ_ABI,
    functionName: "topUpWalletBalance",
    args: [
      topUpWalletAmount && topUpWalletAmount,
      topUpWalletNativeAsset,
      estimatedGasAmount,
    ],
    value: topUpWalletNativeAsset && topUpWalletAmount,
  });

  const { write: topUpWallet } = useContractWrite({
    ...topUpWalletConfig,
    onSuccess(data) {
      alert("Topped Up Wallet Tx Initiated!");
    },
  });

  // WITHDRAW WALLET
  const { config: withdrawWalletConfig } = usePrepareContractWrite({
    address: contractAddress,
    abi: MR_KRABZ_ABI,
    functionName: "withdrawFromWallet",
    args: [assettype && assettype, withdrawWalletAmount, estimatedGasAmount],
  });

  const { write: withdrawWallet } = useContractWrite({
    ...withdrawWalletConfig,
    onSuccess(data) {
      alert("Withdrawn Tx Initiated!");
    },
  });

  // APPROVE
  const { config: approveConfig } = usePrepareContractWrite({
    address: KRABZ.contractAddress[chain.id],
    abi: erc20ABI,
    functionName: "approve",
    args: [
      contractAddress,
      topUpWalletAmount
        ? topUpWalletAmount
        : withdrawWalletAmount
        ? topUpWalletAmount
        : "",
    ],
  });

  const { write: approve } = useContractWrite({
    ...approveConfig,
    onSuccess() {
      console.log("Approved!");
    },
  });

  // GET TICKETS PURCHASED PER ROUND
  const { data: ticketsPurchasedPerRound } = useContractRead({
    address: contractAddress,
    abi: MR_KRABZ_ABI,
    functionName: "getTicketsPurchasedPerRound",
    args: [address],
  });

  // GET USER DETAILS
  const { data: userDetails } = useContractRead({
    address: contractAddress,
    abi: MR_KRABZ_ABI,
    functionName: "getUserDetails",
    args: [address],
  });

  console.log(userDetails);

  return (
    <div className={styles.myAccount}>
      {/* LEFT */}
      <img src="/howToPlay.png" className={styles.howToPlay} />

      {/* RIGHT */}
      <div className={styles.right}>
        {/* TOP */}
        <div className={styles.top}>
          {/* TICKETS PURCHASED */}
          <div className={styles.ticketsPurchased}>
            <img src="/ticketsPurchased.png" />
            <h2>Tickets Purchased For Round</h2>
            <p>
              {ticketsPurchasedPerRound
                ? ticketsPurchasedPerRound.toString()
                : "0"}
            </p>
          </div>

          {/* CROSS-CHAIN BALANCE */}
          <div className={styles.crossChainBalance}>
            <img src="/crossChainBalance.png" />
            <h2>Cross Chain Balance</h2>
            <div className={styles.balances}>
              <div className={styles.polygon}>
                <span>Polygon</span>
                <p>
                  {userDetails &&
                    (userDetails.balance.matic.toString() / 10 ** 18).toFixed(
                      3
                    )}{" "}
                  matic
                </p>
              </div>

              <div className={styles.filecoin}>
                <p>
                  <span>File</span>coin
                </p>
                <p>
                  {userDetails &&
                    (userDetails.balance.fil.toString() / 10 ** 18).toFixed(
                      3
                    )}{" "}
                  fil
                </p>
              </div>

              <div className={styles.krabz}>
                <span>Krabz</span>
                <p>
                  {userDetails &&
                    (userDetails.balance.krabz.toString() / 10 ** 18).toFixed(
                      3
                    )}{" "}
                  krb
                </p>
              </div>
            </div>
          </div>

          {/* WINNINGS */}
          <div className={styles.winnings}>
            <img src="/winnings.png" />
            <h2>My Winnings</h2>

            <div className={styles.winningBalance}>
              <span>Krabz</span>
              <p>
                {userDetails &&
                  (userDetails.totalWinnings.toString() / 10 ** 18).toFixed(
                    3
                  )}{" "}
                krb
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className={styles.bottom}>
          {/* TOP UP WALLET BALANCE */}
          <div className={styles.topUpWalletBalance}>
            <h2>Top Up Wallet balance</h2>
            <div className={styles.button}>
              <button
                className={styles.nativeAsset}
                onClick={() => setTopUpWalletNativeAsset(true)}
              >
                {CHAIN_MAPPING[chain.id].symbol}
              </button>
              <button
                className={styles.krabzToken}
                onClick={() => setTopUpWalletNativeAsset(false)}
              >
                KRABZ
              </button>

              <p style={{ marginTop: "20px" }}>
                Selected Asset :{" "}
                {topUpWalletNativeAsset == false
                  ? "Krb"
                  : CHAIN_MAPPING[chain.id].symbol}
              </p>
            </div>

            <p className={styles.amount}>Amount</p>
            <input
              className={styles.input}
              onChange={(e) =>
                setTopUpWalletAmount(
                  parseEther(e.target.value, "wei").toString()
                )
              }
            />
            {topUpWalletNativeAsset == false && (
              <button
                disabled={!approve}
                onClick={() => approve()}
                className={styles.topup}
              >
                Approve
              </button>
            )}

            <button
              disabled={!topUpWallet}
              onClick={() => topUpWallet()}
              className={styles.topup}
            >
              Top Up
            </button>
          </div>

          {/* WITHDRAW WALLET BALANCE */}
          <div className={styles.withdrawWalletBalance}>
            <h2>Withdraw Wallet balance</h2>
            <div className={styles.button}>
              <button
                className={styles.nativeAsset}
                onClick={() => {
                  setwithdrawWalletNativeAsset(true);
                  setAssetType(chain.id);
                }}
              >
                {CHAIN_MAPPING[chain.id].symbol}
              </button>
              <button
                className={styles.krabzToken}
                onClick={() => {
                  setwithdrawWalletNativeAsset(false);
                  setAssetType(KRABZ.contractAddress[chain.id]);
                }}
              >
                KRABZ
              </button>

              <p style={{ marginTop: "20px" }}>
                Selected Asset :{" "}
                {withdrawWalletNativeAsset == false
                  ? "Krb"
                  : CHAIN_MAPPING[chain.id].symbol}
              </p>
            </div>

            <p className={styles.amount}>Amount</p>
            <input
              className={styles.input}
              onChange={(e) =>
                setWithdrawWalletAmount(parseEther(e.target.value).toString())
              }
            />

            {withdrawWalletNativeAsset == false && (
              <button
                className={styles.topup}
                disabled={!approve}
                onClick={() => approve()}
              >
                Approve
              </button>
            )}

            <button
              className={styles.topup}
              disabled={!withdrawWallet}
              onClick={() => withdrawWallet()}
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
