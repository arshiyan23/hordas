const { execSync } = require("child_process");   // use the real wg tools
const path = require("path");

/** Generate proper Curve25519 keys via `wg` rather than SHA-256 */
function generateKeys() {
  const privateKey = execSync("wg genkey").toString().trim();
  const publicKey  = execSync(`printf '%s' "${privateKey}" | wg pubkey`).toString().trim();
  const presharedKey = execSync("wg genpsk").toString().trim();

  return { privateKey, publicKey, presharedKey };
}

function buildWGConfig({ privateKey, presharedKey, allowedIPs }) {
  return `
[Interface]
PrivateKey = ${privateKey}
Address     = 10.0.0.2/32
DNS         = 1.1.1.1

[Peer]
PublicKey    = MEwjW+VVkiI5WPB/O8GpeT4Iao9q2KRpND7DZsxAJQ0=
PresharedKey = ${presharedKey}
Endpoint     = 13.201.21.86:51820
AllowedIPs   = ${allowedIPs}
PersistentKeepalive = 25
`;
}

module.exports = { generateKeys, buildWGConfig };
