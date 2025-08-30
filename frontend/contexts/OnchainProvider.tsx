"use client";

import { type ReactNode } from "react";
import { base } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";

export function OnchainProvider(props: { children: ReactNode }) {
  return (
    <MiniKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || "demo-api-key"}
      chain={base}
      config={{
        appearance: {
          mode: "auto",
          theme: "mini-app-theme",
          name: "VendedoresApp",
          logo: process.env.NEXT_PUBLIC_URL ? `${process.env.NEXT_PUBLIC_URL}/icon.svg` : "/icon.svg",
        },
      }}
    >
      {props.children}
    </MiniKitProvider>
  );
}
