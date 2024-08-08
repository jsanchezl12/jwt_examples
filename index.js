const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const forge = require('node-forge');

// Datos del payload
const payload = {
  userId: 123,
  username: 'usuario123',
  email: 'usuario@example.com'
};

// Crear el header
const header = {
  alg: 'HS256',
  typ: 'JWT'
};

// Clave secreta para firmar el token
const secret = '123445';

// Función para codificar en Base64 URL
const base64UrlEncode = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');

// Codificar header y payload
const headerBase64 = base64UrlEncode(header);
const payloadBase64 = base64UrlEncode(payload);

// Crear la firma manualmente
const dataToSign = `${headerBase64}.${payloadBase64}`;
const signature = crypto.createHmac('sha256', secret).update(dataToSign).digest('base64url');

// Construir el token
const token = `${dataToSign}.${signature}`;

console.log('JWT:', token);

// Verificar el token
try {
  const decoded = jwt.verify(token, secret, { algorithms: ['HS256'], ignoreNotBefore: true, ignoreExpiration: true });
  //console.log('Token válido con payload:', decoded);
} catch (err) {
  console.log('Token inválido', err);
}

// Obtener y verificar el Z-STRCODE (firma)
const parts = token.split('.');
// const headerDecoded = Buffer.from(parts[0], 'base64url').toString();
// const payloadDecoded = Buffer.from(parts[1], 'base64url').toString();
// const signatureDecoded = parts[2];

function calculateHashHex(jwt) {
  //return crypto.createHash('md5').update(jwt).digest('hex');
  const md = forge.md.md5.create();
  md.update(jwt);
  const checksum = md.digest().toHex();
  return checksum;
}
const signatureDecoded = calculateHashHex(token);
//console.log('Header:', headerDecoded);
//console.log('Payload:', payloadDecoded);
console.log('Signature (Z-STRCODE):', signatureDecoded);

// Verificar la firma manualmente
const verifySignature = crypto.createHmac('sha256', secret).update(`${parts[0]}.${parts[1]}`).digest('base64url');
if (verifySignature === signatureDecoded) {
  console.log('La firma es válida.');
} else {
  console.log('La firma no es válida.');
}