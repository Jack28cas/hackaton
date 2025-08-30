import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  
  const frameHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VendedoresApp - Conecta con vendedores cercanos</title>
    
    <!-- Farcaster Frame Meta Tags -->
    <meta property="fc:frame" content="vNext">
    <meta property="fc:frame:image" content="${baseUrl}/frame-image.svg">
    <meta property="fc:frame:image:aspect_ratio" content="1.91:1">
    <meta property="fc:frame:button:1" content="🛒 Ir a Cliente">
    <meta property="fc:frame:button:1:action" content="link">
    <meta property="fc:frame:button:1:target" content="${baseUrl}/cliente">
    <meta property="fc:frame:button:2" content="🛍️ Ir a Vendedor">
    <meta property="fc:frame:button:2:action" content="link">
    <meta property="fc:frame:button:2:target" content="${baseUrl}/vendedor">
    <meta property="fc:frame:button:3" content="💰 Wallet">
    <meta property="fc:frame:button:3:action" content="link">
    <meta property="fc:frame:button:3:target" content="${baseUrl}/wallet">
    
    <!-- Open Graph -->
    <meta property="og:title" content="VendedoresApp">
    <meta property="og:description" content="Conecta vendedores ambulantes con clientes en tiempo real">
    <meta property="og:image" content="${baseUrl}/frame-image.svg">
    <meta property="og:url" content="${baseUrl}">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="VendedoresApp">
    <meta name="twitter:description" content="Conecta vendedores ambulantes con clientes en tiempo real">
    <meta name="twitter:image" content="${baseUrl}/frame-image.svg">
</head>
<body>
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; padding: 20px;">
        <h1 style="font-size: 3rem; margin-bottom: 1rem;">🛒 VendedoresApp</h1>
        <p style="font-size: 1.2rem; margin-bottom: 2rem; max-width: 600px;">
            Conecta vendedores ambulantes con clientes en tiempo real. 
            Encuentra productos cerca de ti y realiza pagos seguros con crypto.
        </p>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
            <a href="${baseUrl}/cliente" style="background: rgba(255,255,255,0.2); padding: 1rem 2rem; border-radius: 10px; text-decoration: none; color: white; border: 2px solid rgba(255,255,255,0.3); transition: all 0.3s;">
                🛒 Ir a Cliente
            </a>
            <a href="${baseUrl}/vendedor" style="background: rgba(255,255,255,0.2); padding: 1rem 2rem; border-radius: 10px; text-decoration: none; color: white; border: 2px solid rgba(255,255,255,0.3); transition: all 0.3s;">
                🛍️ Ir a Vendedor
            </a>
            <a href="${baseUrl}/wallet" style="background: rgba(255,255,255,0.2); padding: 1rem 2rem; border-radius: 10px; text-decoration: none; color: white; border: 2px solid rgba(255,255,255,0.3); transition: all 0.3s;">
                💰 Wallet
            </a>
        </div>
    </div>
</body>
</html>`;

  return new NextResponse(frameHtml, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

export async function POST(req: NextRequest) {
  // Handle frame interactions
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  
  return NextResponse.json({
    type: 'frame',
    frameUrl: `${baseUrl}/api/frame`,
  });
}
