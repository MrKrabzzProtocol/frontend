import "@/styles/globals.css";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { polygonMumbai, filecoinHyperspace } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";

const { publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai, filecoinHyperspace],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_PROVIDER }),
    publicProvider(),
  ]
);

const config = createConfig({
  publicClient,
  webSocketPublicClient,
});

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig config={config}>
      <Component {...pageProps} />
    </WagmiConfig>
  );
}
