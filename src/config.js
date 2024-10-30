import { http, createConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import { injected, metaMask, safe, walletConnect } from "wagmi/connectors";



export const config = createConfig({
  chains: [polygon],
  connectors: [injected(), metaMask(), safe()],
  transports: {
    [polygon.id]: http(),
  },
});
