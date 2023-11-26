import ZaloPayService from '../src/services/zalopay.service';
import crypto from 'crypto';
import AppConfig from '../src/constants/configs';
const data = {
  app_id: 2553,
  app_trans_id: '200904_2553_1598435687208',
  app_time: 1599189392817,
  app_user: 'e66e0450-1f86-4e9e-b4c1-3d13eeb0c660',
  amount: 10000,
  embed_data: '{"loan_contract_request_id":"e66e0450-1f86-4e9e-b4c1-3d13eeb0c663"}',
  item: '[]',
  zp_trans_id: 200904000000389,
  server_time: 1599189413498,
  channel: 38,
  merchant_user_id: '7ZMSl3nEg5sOUJzOLSoUFT8xKNQVaLOLXHB--8Eytqc',
  user_fee_amount: 0,
  discount_amount: 0,
};

const response = {
  data: JSON.stringify(data),
  mac: crypto
    .createHmac('sha256', AppConfig.ZALOPAY_SANDBOX.key2 as string)
    .update(JSON.stringify(data))
    .digest('hex'),
  type: 1,
};

const zaloPayServices = new ZaloPayService();

console.log(JSON.stringify(response));
console.log(zaloPayServices.verifyOrderMac(response.mac, response.data));
