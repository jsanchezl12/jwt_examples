const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const forge = require('node-forge');

// Datos del payload
// const payload = {
//   userId: 123,
//   username: 'usuario123',
//   email: 'usuario@example.com'
// };

const payload = {
  "sellerId": "112353464",
  "identityNumber": "107274734",
  "identityType": "C",
  "firstName": "Persona",
  "secondName": "nombre",
  "firstSurname": "Apell",
  "secondSurname": "ido",
  "birthDate": "1990/05/22",
  "occupationId": "1",
  "franchise": "4",
  "expirationDate": "2027/08/23",
  "gender": "M",
  "bornCity": "11001",
  "residenceCity": "11001",
  "insuredResidenceCity": "11001",
  "residenceAddress": "Cll 3 1b 00",
  "insuredAddress": "Cll 5 1b 00",
  "otpCode": "25434",
  "paymentType": "2",
  "financialProductId": "2",
  "insuranceId": "62",
  "insuranceCode": "0653",
  "plan": "1",
  "productNumber": "1234567890123456",
  "tcAccountNumber": "1234567890123456789",
  "phone": "3102873654",
  "cellPhone": "3102873654",
  "email": "email@outlook.com",
  "incomes": "2000000",
  "insuredValue": "20000000",
  "insuredValueContent": "2000000",
  "allyCode": "123456",
  "allyName": "TU ALIADO"
};

// Crear el header
const header = {
  alg: 'HS256',
  typ: 'JWT'
};

// Clave secreta para firmar el token
const secret = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpZGVudGl0eVR5cGUiOiJDIiwiaWRlbnRpdHlOdW1iZXIiOiI4MDc5NTA1NCIsImRhdGVUaW1lIjoiMjAyNC0wOC0wNSAxMDo0MjowMyJ9.VmwY1wmA0KDG8wTA76vHukHa27GYr4aSP-15kmJ0P9o0B5WD_YyaT-mKl2FUSsQAKul-5_h7MykFzAENf9hMkfxpygtVz6TfSFidozVLzrbxXcQ31M861on2fUNjnGDVE4sbDMQlF_2XpU1o5bARPAyskWyNv17Qa6CoMpb-QZM';

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