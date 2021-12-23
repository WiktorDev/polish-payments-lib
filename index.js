const hotpay = require('./payments/hotpay/hotpay');
const cashbill = require('./payments/cashbill/cashbill');
const logger = require('./utils/logger');

class HotPay {
  constructor(secret, notification_password) {
    this.secret = secret;
    this.notification_password = notification_password;
    this.generated = false;
  }

  generatePayment(price, service_name, redirect, order_id){
    const data = hotpay.generatePayment(this.secret, this.notification_password, price, service_name, redirect, order_id)
    this.generated = true;
    return data;
  }
  getQuery(){
    if(!this.generated){
      logger.error('Payment is not generated!')
      return "not-generated"
    }
    return hotpay.getQuery()
  }
}

class HotPayPSC {
  constructor(secret, notification_password) {
    this.secret = secret;
    this.notification_password = notification_password;
    this.generated = false;
  }
  
  generatePayment(price, service_name, redirect, order_id) {
    const data = hotpay.generatePSCPayment(this.secret, this.notification_password, price, service_name, redirect, order_id)
    this.generated = true;
    return data;
  }
}

class CashBill{
  constructor(secretPhrase, shopId, production){
    this.secretPhrase = secretPhrase;
    this.shopId = shopId;
    if(production == false){
      this.url = 'https://pay.cashbill.pl/testws/rest';
    }else{
      this.url = 'https://pay.cashbill.pl/ws/rest';
    }
  }

  generatePayment(title, amount, currency){
    const data = cashbill.generatePayment(title, amount, currency, this.secretPhrase, this.shopId, this.url);
    return data;
  }

  setRedirectURLS(orderId, returnUrl, negativeReturnUrl){
    cashbill.setRedirectURLS(orderId, returnUrl, negativeReturnUrl, this.secretPhrase, this.shopId, this.url)
  }

  getPaymentInfo(orderId){
    const data = cashbill.getPaymentInfo(orderId, this.secretPhrase, this.shopId, this.url)
    return data;
  }
}

module.exports = { HotPay, HotPayPSC, CashBill }