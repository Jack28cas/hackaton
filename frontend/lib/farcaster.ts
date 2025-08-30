import { mnemonicToAccount } from 'viem/accounts'
import { createWalletClient, http } from 'viem'
import { mainnet } from 'viem/chains'

export interface FarcasterManifest {
  accountAssociation: {
    header: string
    payload: string
    signature: string
  }
  relay?: string
  fallback?: boolean
  exclude?: string[]
}

export function getFarcasterAccount() {
  const mnemonic = process.env.FARCASTER_MNEMONIC
  if (!mnemonic) {
    throw new Error("Missing FARCASTER_MNEMONIC in .env.local")
  }

  console.log('🔑 Creating Farcaster account from mnemonic...')
  
  const account = mnemonicToAccount(mnemonic)
  const client = createWalletClient({
    account,
    chain: mainnet,
    transport: http()
  })

  console.log('✅ Farcaster account created:', account.address)
  
  return { account, client }
}

export async function signFarcasterManifest(manifest: any) {
  try {
    console.log('📝 Signing Farcaster manifest...')
    
    const { account, client } = getFarcasterAccount()
    
    const message = JSON.stringify(manifest)
    console.log('📄 Manifest to sign:', message)
    
    const signature = await client.signMessage({
      account,
      message
    })

    console.log('✅ Manifest signed successfully')
    console.log('🔐 Signature:', signature)
    console.log('📍 Address:', account.address)

    return { 
      signature, 
      address: account.address,
      message 
    }
  } catch (error) {
    console.error('❌ Error signing manifest:', error)
    throw error
  }
}

export function createFarcasterManifest() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
  
  const manifest = {
    name: "VendedoresApp",
    icon: `${baseUrl}/icon.png`,
    url: baseUrl,
    description: "Conecta vendedores ambulantes con clientes en tiempo real",
    accountAssociation: {
      header: process.env.FARCASTER_HEADER || "",
      payload: process.env.FARCASTER_PAYLOAD || "",
      signature: process.env.FARCASTER_SIGNATURE || ""
    }
  }

  return manifest
}

export function validateFarcasterConfig() {
  const requiredVars = [
    'FARCASTER_MNEMONIC',
    'NEXT_PUBLIC_URL'
  ]

  const missing = requiredVars.filter(varName => !process.env[varName])
  
  if (missing.length > 0) {
    console.warn('⚠️ Missing Farcaster config:', missing)
    return false
  }

  return true
}
