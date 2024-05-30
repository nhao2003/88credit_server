import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
export type ZaloPayOrderRequest = {
  app_user: string;
  amount: number;
  item: Record<string, any>[];
  description: string;
  embed_data: Record<string, any>;
  bank_code: string | 'zalopayapp';
  app_time: Date;
  app_trans_id?: string;
  callback_url?: string;
  phone?: string;
  email?: string;
};

export type MiniAppTransactionDataCallback = {
  appId: string;
  orderId: string;
  transId: string;
  transTime: number;
  merchantTransId: string;
  amount: number;
  description: string;
  resultCode: number;
  message: string;
  extradata: string;
};

export type BodyCreateOrderRequest = {
  app_id: number;
  mac: string;
  app_user: string;
  amount: number;
  item: string;
  description: string;
  embed_data: string;
  bank_code: string | 'zalopayapp';
  app_trans_id: string;
  app_time: number;
  callback_url?: string | null;
  phone?: string | null;
  email?: string | null;
};

export type ZaloPayOrderResponse = {
  return_code: number; // 1: Thành công, 2: Thất bại
  return_message: string; // Mô tả mã trạng thái
  sub_return_code: number; // Mã trạng thái chi tiết
  sub_return_message: string; // Mô tả chi tiết mã trạng thái
  order_url: string; // Dùng để tạo QR code hoặc gọi chuyển tiếp sang trang cổng ZaloPay
  zp_trans_token: string; // Thông tin token đơn hàng
  order_token: string; // Thông tin token đơn hàng
  qr_code: string; // Dùng để tạo NAPAS VietQR trên hệ thống Merchant
  app_trans_id: string; // Mã giao dịch của hệ thống Merchant
};

export type ZaloPayCallbackResponse = {
  app_id: number; // app_id của đơn hàng
  app_trans_id: string; // app_trans_id của đơn hàng
  app_time: number; // app_time của đơn hàng
  app_user: string; // app_user của đơn hàng
  amount: number; // Số tiền ứng dụng nhận được
  embed_data: string; // embed_data của đơn hàng
  item: string; // item của đơn hàng
  zp_trans_id: number; // Mã giao dịch của ZaloPay
  server_time: number; // Thời gian giao dịch của ZaloPay (unix timestamp in miliseconds)
  channel: number; // Kênh thanh toán
  merchant_user_id: string; // ZaloPay user đã thanh toán cho đơn hàng
  user_fee_amount: number; // Số tiền phí
  discount_amount: number; // Số tiền giảm giá
};
@Injectable()
export class ZaloPayService {
  private zaloPayAPI: string;
  private zaloPaySandboxPrivateKey: string;
  private zaloPaySandboxAppId: string;
  private zaloPaySandboxKey1: string;
  private zaloPaySandboxKey2: string;

  constructor(
    zaloPayAPI: string,
    zaloPaySandboxPrivateKey: string,
    zaloPaySandboxAppId: string,
    zaloPaySandboxKey1: string,
    zaloPaySandboxKey2: string,
  ) {
    this.zaloPayAPI = zaloPayAPI;
    this.zaloPaySandboxPrivateKey = zaloPaySandboxPrivateKey;
    this.zaloPaySandboxAppId = zaloPaySandboxAppId;
    this.zaloPaySandboxKey1 = zaloPaySandboxKey1;
    this.zaloPaySandboxKey2 = zaloPaySandboxKey2;
  }

  public generateTransactionId(date: Date): string {
    const year = date.getFullYear().toString().slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    let prefix = `${year}${month}${day}_`;
    while (prefix.length < 20) {
      prefix += Math.floor(Math.random() * 10);
    }
    if (prefix.length > 40) {
      throw new Error('Transaction id is too long');
    }

    return prefix;
  }
  private createOrderMac(order: ZaloPayOrderRequest) {
    const data =
      this.zaloPaySandboxAppId +
      '|' +
      (order.app_trans_id || this.generateTransactionId(order.app_time)) +
      '|' +
      order.app_user +
      '|' +
      order.amount +
      '|' +
      order.app_time.getTime() +
      '|' +
      JSON.stringify(order.embed_data) +
      '|' +
      JSON.stringify(order.item);
    const hmac = crypto
      .createHmac('sha256', this.zaloPaySandboxKey1)
      .update(data)
      .digest('hex');
    return hmac;
  }

  public async createOrder(
    orderRequest: ZaloPayOrderRequest,
  ): Promise<ZaloPayOrderResponse> {
    orderRequest.app_trans_id =
      orderRequest.app_trans_id ||
      this.generateTransactionId(orderRequest.app_time);
    const body: BodyCreateOrderRequest = {
      app_id: Number(this.zaloPaySandboxAppId),
      mac: this.createOrderMac(orderRequest),
      app_trans_id: orderRequest.app_trans_id,
      app_user: orderRequest.app_user,
      app_time: orderRequest.app_time.getTime(),
      item: JSON.stringify(orderRequest.item),
      embed_data: JSON.stringify(orderRequest.embed_data),
      amount: orderRequest.amount,
      description: orderRequest.description,
      bank_code: orderRequest.bank_code,
      callback_url: orderRequest.callback_url,
      phone: orderRequest.phone,
      email: orderRequest.email,
    };
    console.log(body);
    const response = await fetch(this.zaloPayAPI, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const json = await response.json();
    return {
      ...json,
      app_trans_id: orderRequest.app_trans_id,
    };
  }
  public verifyOrderMac(mac: string, callbackData: string): boolean {
    return (
      crypto
        .createHmac('sha256', this.zaloPaySandboxKey2)
        .update(callbackData)
        .digest('hex') === mac
    );
  }
  public verifyMiniAppOrderMac(
    data: MiniAppTransactionDataCallback,
    mac: string,
  ): boolean {
    const callbackData = `appId=${data.appId}&amount=${data.amount}&description=${data.description}&orderId=${data.orderId}&message=${data.message}&resultCode=${data.resultCode}&transId=${data.transId}`;
    const hmac = crypto
      .createHmac('sha256', this.zaloPaySandboxPrivateKey)
      .update(callbackData)
      .digest('hex');
    return hmac === mac;
  }
}
