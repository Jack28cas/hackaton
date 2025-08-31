"use client";

import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function WalletConnect() {
  return (
    <Wallet className="z-10">
      <ConnectWallet>
        <Name className="text-inherit" />
      </ConnectWallet>
      <WalletDropdown>
        <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
          <Avatar />
          <Name />
          <Address />
          <EthBalance />
        </Identity>
        <WalletDropdownDisconnect />
      </WalletDropdown>
    </Wallet>
  );
}

export function WalletInfo() {
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Conectar Wallet</CardTitle>
          <CardDescription>
            Conecta tu wallet para acceder a funciones Web3
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WalletConnect />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-green-600">¡Wallet Conectada!</CardTitle>
        <CardDescription>
          Tu wallet está conectada a Base
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Identity className="flex items-center gap-3" hasCopyAddressOnClick>
            <Avatar />
            <div>
              <Name className="font-semibold" />
              <Address className="text-sm text-gray-600" />
            </div>
          </Identity>
          <div className="pt-2">
            <EthBalance className="text-lg font-medium text-green-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


