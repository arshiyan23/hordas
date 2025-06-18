const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { execSync } = require('child_process');
const { generateKeys, buildWGConfig } = require('./utils/wireguard');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/config/generate', async (req, res) => {
  try {
    const { allowedIPs } = req.body; // optional, e.g. ['157.240.0.0/16']
    const keys = generateKeys();

    const allowedIPsStr = allowedIPs?.join(', ') || '0.0.0.0/0';

    // Build WireGuard config
    const config = buildWGConfig({
      privateKey: keys.privateKey,
      presharedKey: keys.presharedKey,
      allowedIPs: allowedIPsStr
    });

    // Save PSK to temp file
    const pskPath = '/tmp/psk.txt';
    fs.writeFileSync(pskPath, keys.presharedKey);

    // Add peer to server (10.0.0.2 is fixed here; can be dynamic later)
    execSync(`sudo wg set wg0 peer ${keys.publicKey} preshared-key ${pskPath} allowed-ips 10.0.0.2/32`);
    fs.unlinkSync(pskPath);

    // Optionally save the config file (for audit/debug)
    const fileName = `/tmp/wg-client-${Date.now()}.conf`;
    fs.writeFileSync(fileName, config);

    return res.json({ config, keys });
  } catch (err) {
    console.error('Error generating config:', err.message);
    return res.status(500).json({ error: 'Failed to generate WireGuard config' });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Boznav backend running on port ${PORT}`));
