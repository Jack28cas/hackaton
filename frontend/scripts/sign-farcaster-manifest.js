const { mnemonicToAccount } = require('viem/accounts')
const { createWalletClient, http } = require('viem')
const { mainnet } = require('viem/chains')
require('dotenv').config({ path: '.env.local' })

async function signManifest() {
  try {
    console.log('🚀 Starting Farcaster manifest signing...')
    
    // Verificar que tenemos la mnemonic
    const mnemonic = process.env.FARCASTER_MNEMONIC
    if (!mnemonic) {
      throw new Error('FARCASTER_MNEMONIC not found in .env.local')
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
    console.log('🌐 Base URL:', baseUrl)

    // Crear cuenta desde la mnemonic
    console.log('🔑 Creating account from mnemonic...')
    const account = mnemonicToAccount(mnemonic)
    
    const client = createWalletClient({
      account,
      chain: mainnet,
      transport: http()
    })

    console.log('✅ Account created:', account.address)

    // Crear el manifest
    const manifest = {
      name: "VendedoresApp",
      icon: `${baseUrl}/icon.png`,
      url: baseUrl,
      description: "Conecta vendedores ambulantes con clientes en tiempo real",
      accountAssociation: {
        header: "0x...", // Se completará después
        payload: "0x...", // Se completará después  
        signature: "0x..." // Se completará después
      }
    }

    console.log('📄 Manifest created:', JSON.stringify(manifest, null, 2))

    // Firmar el manifest
    console.log('📝 Signing manifest...')
    const message = JSON.stringify(manifest)
    
    const signature = await client.signMessage({
      account,
      message
    })

    console.log('✅ Manifest signed successfully!')
    console.log('')
    console.log('📋 Add these values to your .env.local:')
    console.log('=' .repeat(50))
    console.log(`FARCASTER_HEADER="0x${Buffer.from(JSON.stringify({
      fid: 1234, // Reemplaza con tu FID real
      type: "custody",
      key: account.address
    })).toString('hex')}"`)
    console.log(`FARCASTER_PAYLOAD="0x${Buffer.from(message).toString('hex')}"`)
    console.log(`FARCASTER_SIGNATURE="${signature}"`)
    console.log('=' .repeat(50))
    console.log('')
    console.log('🎉 Done! Copy the values above to your .env.local file')

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

signManifest()
