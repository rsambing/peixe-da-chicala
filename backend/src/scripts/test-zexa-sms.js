// Script manual de diagnóstico — NÃO é chamado pelo servidor.
// Uso: node src/scripts/test-zexa-sms.js 244931133281
import 'dotenv/config';
import { ZexaService } from '../services/zexa.service.js';
import { normalizePhone, toZexaRecipient } from '../lib/phone.js';

const rawNumber = process.argv[2] || '244931133281';
const zexa = new ZexaService();
const recipient = toZexaRecipient(normalizePhone(rawNumber));

console.log(`A enviar SMS de teste para: ${recipient}`);

const result = await zexa.sendSms({
  recipient,
  body: 'Teste Peixe da Chicala - ignore esta mensagem.',
  isOtp: true,
});

console.log(JSON.stringify(result, null, 2));
