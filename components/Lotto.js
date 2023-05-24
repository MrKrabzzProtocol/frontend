import { useState } from "react";
import styles from "../styles/components/Lotto.module.css";
import {
  useAccount,
  useBlockNumber,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi";
import {
  CHAIN_MAPPING,
  FVM_CHAIN_ID,
  KRABZ,
  POLYGON_CHAIN_ID,
  getEndDateForLotto,
} from "@/utils";
import { parseEther } from "viem";
import { MR_KRABZ_ABI } from "@/abi";

export const Lotto = () => {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { data } = useBlockNumber();

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

  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [nativeAsset, setNativeAsset] = useState();

  const handleNumberClick = (number) => {
    if (selectedNumbers.length < 3 && !selectedNumbers.includes(number)) {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  const handleClearSelection = () => {
    setSelectedNumbers([]);
  };

  const renderNumberedTags = () => {
    const numberedTags = [];

    for (let i = 1; i <= 30; i++) {
      let color;

      if (selectedNumbers[0] == i) {
        color = "red";
      }

      if (selectedNumbers[1] == i) {
        color = "green";
      }

      if (selectedNumbers[2] == i) {
        color = "blue";
      }

      numberedTags.push(
        <p
          key={i}
          className={
            color == "red"
              ? styles.redNumber
              : color == "green"
              ? styles.greenNumber
              : color == "blue"
              ? styles.blueNumber
              : styles.regularNumber
          }
          onClick={() => handleNumberClick(i)}
        >
          {i}
        </p>
      );
    }

    return numberedTags;
  };

  // GET ROUND DETAILS
  const { data: roundDetails } = useContractRead({
    address: CHAIN_MAPPING[chain.id].contractAddress,
    abi: MR_KRABZ_ABI,
    functionName: "getCurrentRoundDetails",
  });

  console.log("rd", roundDetails);

  // get user ticket for currentRound
  const { data: userTickets } = useContractRead({
    address: contractAddress,
    abi: MR_KRABZ_ABI,
    functionName: "getUserTicketsForCurrentRound",
    args: [address],
  });

  // get asstet prices
  const { data: filPrice } = useContractRead({
    address: contractAddress,
    abi: MR_KRABZ_ABI,
    functionName: "getAssetPriceUsd",
    args: ["fil"],
  });

  // get asstet prices
  const { data: maticPrice } = useContractRead({
    address: contractAddress,
    abi: MR_KRABZ_ABI,
    functionName: "getAssetPriceUsd",
    args: ["matic"],
  });

  // get asstet prices
  const { data: krabzPrice } = useContractRead({
    address: contractAddress,
    abi: MR_KRABZ_ABI,
    functionName: "getAssetPriceUsd",
    args: ["badger"],
  });

  // get timestamp
  const { data: currenTimeStamp } = useContractRead({
    address: contractAddress,
    abi: MR_KRABZ_ABI,
    functionName: "getCurrentTimeStamp",
    args: [],
  });

  // BUY TICKET

  const { config: buyTicketConfig } = usePrepareContractWrite({
    address: contractAddress,
    abi: MR_KRABZ_ABI,
    functionName: "buyTicket",
    args: [selectedNumbers, nativeAsset, estimatedGasAmount],
  });

  const { write: buyTicket } = useContractWrite({
    ...buyTicketConfig,
    onSuccess(data) {
      alert("Ticket Buy Tx Initiated!");
    },
  });

  const [ticketId, setTicketId] = useState();
  const [selectedTicket, setSelectedTicket] = useState();

  // claim refund
  // claimRefund(uint256 _ticketId, uint256 _estimateGasAmountOne)
  const { config: claimRefundConfig } = usePrepareContractWrite({
    address: contractAddress,
    abi: MR_KRABZ_ABI,
    functionName: "claimRefund",
    args: [ticketId && ticketId, estimatedGasAmount],
  });

  const { write: claimRefund } = useContractWrite({
    ...claimRefundConfig,
    onSuccess(data) {
      alert("Refund Claimed!");
    },
  });

  // claim win
  // claimWinnings(uint256 _ticketId, uint256 _estimateGasAmountOne)
  const { config: claimWinConfig } = usePrepareContractWrite({
    address: contractAddress,
    abi: MR_KRABZ_ABI,
    functionName: "claimWinnings",
    args: [ticketId && ticketId, estimatedGasAmount],
  });

  const { write: claimWin } = useContractWrite({
    ...claimWinConfig,
    onSuccess(data) {
      alert("Refund Claimed!");
    },
  });

  // if (userTickets) console.log(userTickets);

  return (
    <div className={styles.lotto}>
      {/* TOP */}
      <div className={styles.top}>
        <h2>
          Round Name: <span>{roundDetails && roundDetails.roundName}</span>
        </h2>
        {/* round details */}
        <div className={styles.roundDetails}>
          {/* round id */}
          <div className={styles.roundInfo}>
            <h4>Current Round ID</h4>
            <p># {roundDetails && roundDetails.roundId.toString()}</p>
          </div>

          {/* tickets purchased */}
          <div className={styles.roundInfo}>
            <h4>Tickets Purchased</h4>
            <p>{roundDetails && roundDetails.ticketsPurchased.toString()}</p>
          </div>

          {/* time left */}
          <div className={styles.roundInfo}>
            <h4>Time left until round ends</h4>
            <p>
              {roundDetails &&
                currenTimeStamp &&
                getEndDateForLotto(
                  parseInt(roundDetails.roundEndTime.toString()) -
                    parseInt(currenTimeStamp.toString())
                )}
            </p>
          </div>

          {/* round state */}
          <div className={styles.roundInfo}>
            <h4>Round State</h4>
            <p>
              {roundDetails && roundDetails.roundState ? "Announced" : "Open"}
            </p>
          </div>

          {/* reward pool  */}
          <div className={styles.roundInfo}>
            <h4>Crosss Chain Reward Pool</h4>
            <div className={styles.rewardPool}>
              {/* /polygon */}
              <p className={styles.polygon}>
                <span>
                  {roundDetails &&
                    (roundDetails.balance.matic.toString() / 10 ** 18).toFixed(
                      4
                    )}
                </span>{" "}
                Matic
              </p>

              {/* /filecoin */}
              <p className={styles.filecoin}>
                <span>
                  {roundDetails &&
                    (roundDetails.balance.fil.toString() / 10 ** 18).toFixed(4)}
                </span>{" "}
                Fil
              </p>

              {/* /krabz */}
              <p className={styles.krabz}>
                <span>
                  {roundDetails &&
                    (roundDetails.balance.krabz.toString() / 10 ** 18).toFixed(
                      4
                    )}
                </span>{" "}
                Krabz
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ROUND WINNING NUMBERS */}
      {roundDetails && roundDetails.roundState && (
        <div className={styles.winningNumber}>
          <h3>
            Lotto Winning Numbers: Round{" "}
            <span style={{ color: "#1969FF" }}>
              # {roundDetails && roundDetails.roundId.toString()}
            </span>
          </h3>

          <div className={styles.numbers}>
            <div className={styles.numberOne}>
              {roundDetails && roundDetails.roundWinningNumbers[0].toString()}
            </div>
            <div className={styles.numberTwo}>
              {roundDetails && roundDetails.roundWinningNumbers[1].toString()}
            </div>
            <div className={styles.numberThree}>
              {roundDetails && roundDetails.roundWinningNumbers[2].toString()}
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM */}
      <div className={styles.bottom}>
        {/* LOTTERY BOX */}
        {roundDetails && roundDetails.roundState == false && (
          <div className={styles.lotteryBox}>
            <h3>Select 3 Numbers</h3>

            <div className={styles.yourPicks}>
              <p>Your Picks: </p>
              {selectedNumbers && (
                <p className={styles.pickOne}>{selectedNumbers[0]} |</p>
              )}
              {selectedNumbers && (
                <p className={styles.pickTwo}>{selectedNumbers[1]} |</p>
              )}
              {selectedNumbers && (
                <p className={styles.pickThree}>{selectedNumbers[2]} |</p>
              )}
            </div>

            <div className={styles.ticketPrice}>
              <p>Ticket price</p>

              <div className={styles.asset}>
                {filPrice && maticPrice && (
                  <p className={styles.fil}>
                    {chain.id == FVM_CHAIN_ID
                      ? (
                          roundDetails.ticketPrice.toString() /
                          filPrice.toString()
                        ).toFixed(4)
                      : (
                          roundDetails.ticketPrice.toString() /
                          maticPrice.toString()
                        ).toFixed(4)}{" "}
                    {CHAIN_MAPPING[chain.id].symbol} |
                  </p>
                )}
                {krabzPrice && (
                  <p className={styles.krb}>
                    {(
                      roundDetails.ticketPrice.toString() /
                      krabzPrice.toString()
                    ).toFixed(4)}
                    Krb
                  </p>
                )}
              </div>
            </div>

            <p style={{ marginBottom: "20px" }}>
              Selected Asset : {nativeAsset == false && KRABZ.symbol}{" "}
              {nativeAsset && CHAIN_MAPPING[chain.id].symbol}
            </p>

            <div className={styles.buttons}>
              <button
                className={styles.buyTicket}
                disabled={!buyTicket}
                onClick={() => buyTicket()}
              >
                Buy Ticket
              </button>
              <button
                className={styles.clearSelection}
                onClick={handleClearSelection}
              >
                Clear
              </button>
            </div>

            <div className={styles.buttons}>
              <button
                className={styles.buyTicket}
                onClick={() => setNativeAsset(false)}
              >
                Krabz
              </button>
              <button
                className={styles.clearSelection}
                onClick={() => setNativeAsset(true)}
              >
                Fil
              </button>
            </div>

            <div className={styles.selection}>{renderNumberedTags()}</div>
          </div>
        )}

        {/* MY TICKETS */}
        <div className={styles.myTickets}>
          <h3>My Tickets</h3>

          {roundDetails && roundDetails.roundState && (
            <button
              className={styles.lastButton}
              style={{ backgroundColor: "red", marginLeft: "-4px" }}
              disabled={selectedTicket == false ? !claimRefund : !claimWin}
              onClick={() => {
                if (selectedTicket == false) {
                  claimRefund();
                } else {
                  claimWin();
                }
              }}
            >
              {selectedTicket == false ? "Refund" : "Claim"}
            </button>
          )}

          {userTickets ? (
            userTickets.map((ticket) => {
              return (
                <div
                  className={
                    ticketId == ticket.ID.toString()
                      ? styles.selectedTicket
                      : styles.ticket
                  }
                  onClick={() => {
                    setTicketId(ticket.ID.toString());
                    if (
                      roundDetails.roundWinningNumbers.toString() ==
                      ticket.selectedNumbers.toString()
                    ) {
                      setSelectedTicket(true);
                    } else {
                      setSelectedTicket(false);
                    }
                  }}
                >
                  <img src="/ticket.png" />

                  <div className={styles.ticketId}>
                    <h4>Ticket Id</h4>
                    <p># {ticket.ID.toString()}</p>
                  </div>

                  <div className={styles.ticketPicks}>
                    <h4>Ticket Picks</h4>
                    <div className={styles.picks}>
                      <p className={styles.pickOne}>
                        {ticket.selectedNumbers[0].toString()} |
                      </p>
                      <p className={styles.pickTwo}>
                        {ticket.selectedNumbers[1].toString()} |
                      </p>
                      <p className={styles.pickThree}>
                        {ticket.selectedNumbers[2].toString()} |
                      </p>
                    </div>
                  </div>

                  {roundDetails && roundDetails.roundState && (
                    <div className={styles.outCome}>
                      <h4>Outcome</h4>
                      <p>
                        {roundDetails.roundWinningNumbers.toString() ==
                        ticket.selectedNumbers.toString()
                          ? "Win"
                          : "Loss"}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p>No Tickets Purchased!</p>
          )}
        </div>
      </div>
    </div>
  );
};
