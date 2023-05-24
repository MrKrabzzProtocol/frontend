// VARIABLES
const CHAIN_MAPPING = {
  3141: {
    name: "Filecoin",
    contractAddress:
      "0x0eC3f91fd87b7832CF950A58A8E9994969DEF606".toLocaleLowerCase(),
    symbol: "FIL",
  },
  80001: {
    name: "Polygon",
    contractAddress:
      "0x698F44D5e14E51a23772C9c1CEC41B837FD08983".toLocaleLowerCase(),
    symbol: "MATIC",
  },
};

const KRABZ = {
  name: "Krabz",
  contractAddress: {
    3141: "0xAC90cdbBb9AD436bDcF9693706dd900702105E55",
    80001: "0x1553085A00672599F87BbFb63082Faf240Ab6483",
  },
  symbol: "Krb",
};

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

const FVM_CHAIN_ID = 3141;
const POLYGON_CHAIN_ID = 80001;

// FUNCTIONS

function truncateAddr(address) {
  return address.slice(0, 5) + "...." + address.slice(-5);
}

function getEndDateForLotto(durationInSeconds) {
  const seconds = Math.floor(durationInSeconds % 60);
  const minutes = Math.floor((durationInSeconds / 60) % 60);
  const hours = Math.floor((durationInSeconds / 3600) % 24);
  const days = Math.floor(durationInSeconds / (3600 * 24));

  const parts = [];

  if (days > 0) {
    parts.push(`${days} day${days > 1 ? "s" : ""}`);
  }
  if (hours > 0) {
    parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
  }
  if (seconds > 0) {
    parts.push(`${seconds} second${seconds > 1 ? "s" : ""}`);
  }

  if (parts.length === 0) {
    return "0 seconds";
  }

  return parts.join(", ");
}

module.exports = {
  CHAIN_MAPPING,
  truncateAddr,
  KRABZ,
  FVM_CHAIN_ID,
  POLYGON_CHAIN_ID,
  getEndDateForLotto,
  ADDRESS_ZERO,
};
