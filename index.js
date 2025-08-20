const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode');
const express = require('express');
const app = express();
const PORT = 3000;

let currentQR = ''; // Store latest QR

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>HASA Bot QR</title></head>
      <body>
        <h1>🤖 HASA Bot QR Code</h1>
        ${currentQR ? `<img src="${currentQR}" />` : '<p>QR code not available</p>'}
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`🌐 QR Dashboard: https://replit.com/@yourusername/yourprojectname`);
});

(async () => {
  const { state, saveCreds } = await useMultiFileAuthState('auth');
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { qr } = update;
    if (qr) {
      currentQR = await qrcode.toDataURL(qr); // Convert QR to base64 image
      console.log('📸 QR code updated for browser preview');
    }
  });
})();
