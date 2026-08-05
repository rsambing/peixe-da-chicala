const BRAND = 'Peixe da Chicala';

function fmtKz(total) {
  return Math.round(total).toLocaleString('pt-AO');
}

function stripAccents(text) {
  return String(text ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function buildOrderConfirmedSms(order) {
  const total = fmtKz(order.total);
  if (order.region) {
    return `${BRAND}: pedido ${order.trackingCode} recebido! Total ${total} Kz. Entrega em ${stripAccents(order.region)}. Avisamos quando estiver pronto. Obrigado!`;
  }
  const modo = order.address === 'RETIRADA' ? 'Retirada no local' : 'Recebido';
  return `${BRAND}: pedido ${order.trackingCode} recebido! Total ${total} Kz. ${modo}. Avisamos quando estiver pronto. Obrigado!`;
}

export function buildReadySms(order, status) {
  const total = fmtKz(order.total);
  if (status === 'SAIU_PARA_ENTREGA') {
    return `${BRAND}: o seu pedido ${order.trackingCode} saiu para entrega! Chega em breve. Total ${total} Kz. Obrigado pela preferencia!`;
  }
  return `${BRAND}: o seu pedido ${order.trackingCode} foi entregue. Bom apetite! Obrigado pela preferencia.`;
}
