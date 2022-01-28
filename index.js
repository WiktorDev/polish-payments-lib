const hotpay = require('./payments/hotpay/hotpay');
const cashbill = require('./payments/cashbill/cashbill');
const microsms = require('./payments/microsms/microsms');
const dpay = require('./payments/dpay/dpay')
const pbl = require('./payments/paybylink/pbl')
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

  generatePayment(title, amount, currency, description=null, additionalData=null, paymentChannel=null, languageCode=null, firstName=null, surname=null, email=null){
    const data = cashbill.generatePayment(this.secretPhrase, this.shopId, this.url, title, amount, currency, description, additionalData, paymentChannel, languageCode, firstName, surname, email)
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
class MicroSMS{
  constructor(userID, shopID){
    this.shopID = shopID;
    this.userID = userID;
  }

  generatePayment(amount, hash, control = null, return_urlc = null, return_url = null, description = null){
    return microsms.generatePayment(this.userID, this.shopID, hash, amount, control, return_urlc, return_url, description);
  }

  checkIP(ip){
    const data = microsms.checkIP(ip);
    return data;
  }

  checkSMSCode(code){
    const data = microsms.checkSMSCode(code, this.userID, this.shopID);
    return data;
  }
}

class DPay{
  constructor(service, secret, production){
    this.service = service;
    this.secret = secret;
    this.production = production;
  }
  generatePayment(price, successURL, failURL, ipnURL, description=null, custom=null, installment=null, creditCard=null, paysafecard=null, paypal=null, noBanks=null, channel=null, email=null, client_name=null, client_surname=null, accept_tos=true, style='default'){
    const data = dpay.generatePayment(this.service, this.secret, this.production, price, successURL, failURL, ipnURL, description, custom, installment, creditCard, paysafecard, paypal, noBanks, channel, email, client_name, client_surname, accept_tos, style);
    return data;
  }
  getPaymentInfo(transactionID){
    const data = dpay.getPaymentInfo(this.service, this.secret, this.production, transactionID);
    return data;
  }
}

class PayByLinkPSC{
  constructor(userID, shopID, pin){
    this.userID = userID;
    this.shopID = shopID;
    this.pin = pin;
  }
  generatePayment(price, returnSuccess, returnFail, notyficationURL, description=null){
    const pid = pbl.pscPayment(this.userID, this.shopID, this.pin, price, returnSuccess, returnFail, notyficationURL, description);
    return pid;
  }
}

class PayByLink{
  constructor(shopID, hash){
    this.hash = hash;
    this.shopID = shopID;
  }
  generatePayment(price, control, description, email, returnSuccess, notyficationURL, customFinishNote){
    const data = pbl.bankTransfer(this.shopID, this.hash, price, control, description, email, notyficationURL, returnSuccess, customFinishNote)
    return data;
  }

  generateIpnHash(request){
    var signature = pbl.generateIpnHash(this.hash, request);
    return signature;
  }
}

class PayByLinkDB{
  constructor(login, password, hash){
    this.login = login;
    this.password = password;
    this.hash = hash;
  }
  generatePayment(price, description, control){
    const data = pbl.generateDBPayment(this.login, this.password, this.hash, price, description, control)
    return data;
  }

  getPaymentInfo(clientURL){
    const data = pbl.getDBPaymentInfo(this.login, this.password, this.hash, clientURL)
    return data;
  }
}
class PayByLinkSMS{
  constructor(userID, serviceID){
    this.userID = userID;
    this.serviceID = serviceID;
  }

  checkCode(number, code){
    const data = pbl.checkCode(this.userID, this.serviceID, number, code)
    return data;
  }
}

module.exports = { HotPay, HotPayPSC, CashBill, MicroSMS, DPay, PayByLinkPSC, PayByLink, PayByLinkDB, PayByLinkSMS }