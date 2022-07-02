const hotpay = require('./payments/hotpay');
const cashbill = require('./payments/cashbill');
const microsms = require('./payments/microsms');
const dpay = require('./payments/dpay');
const pbl = require('./payments/pbl');
const paynow = require('./payments/paynow');
const lvlup = require('./payments/lvlup');
const paypal = require('./payments/paypal')

class HotPaySMS {
  constructor(secret) {
    this.secret = secret;
  }
  checkCode(code){
    return hotpay.checkCode(this.secret, code)
  }
  generateMultiSMS(){

  }
}

class HotPay {
  constructor(secret, notification_password) {
    this.secret = secret;
    this.notification_password = notification_password;
  }
  generatePayment(price, service_name, redirect, order_id){
    return hotpay.generatePayment(this.secret, this.notification_password, price, service_name, redirect, order_id);
  }
}

class HotPayDB{
  constructor(secret, password) {
    this.secret = secret;
    this.password = password;
  }
  generatePayment(type, price, service_name, redirect_ok, redirect_fail, order_id){
    return hotpay.generateDirectBillingPayment(type, this.secret, this.password, price, service_name, redirect_ok, redirect_fail, order_id)
  }
  generateHash(data){
    return hotpay.generateDirectBillingHash(data, this.password)
  }
}

class HotPayPSC {
  constructor(secret, notification_password) {
    this.secret = secret;
    this.notification_password = notification_password;
  }
  generatePayment(price, service_name, redirect, order_id) {
    return hotpay.generatePSCPayment(this.secret, this.notification_password, price, service_name, redirect, order_id);
  }
}

class CashBill{
  constructor(secretPhrase, shopId, sandbox){
    this.secretPhrase = secretPhrase;
    this.shopId = shopId;
    if(sandbox === true){
      this.url = 'https://pay.cashbill.pl/testws/rest';
    }else{
      this.url = 'https://pay.cashbill.pl/ws/rest';
    }
  }

  generatePayment(title, amount, currency, description=null, additionalData=null, paymentChannel=null, languageCode=null, firstName=null, surname=null, email=null){
    return cashbill.generatePayment(this.secretPhrase, this.shopId, this.url, title, amount, currency, description, additionalData, paymentChannel, languageCode, firstName, surname, email);
  }

  setRedirectURLS(orderId, returnUrl, negativeReturnUrl){
    cashbill.setRedirectURLS(orderId, returnUrl, negativeReturnUrl, this.secretPhrase, this.shopId, this.url)
  }

  getPaymentInfo(orderId){
    return cashbill.getPaymentInfo(orderId, this.secretPhrase, this.shopId, this.url);
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
    return microsms.checkIP(ip);
  }

  checkSMSCode(code){
    return microsms.checkSMSCode(code, this.userID, this.shopID);
  }
}

class DPay{
  constructor(service, secret, production){
    this.service = service;
    this.secret = secret;
    this.production = production;
  }
  generatePayment(price, successURL, failURL, ipnURL, description=null, custom=null, installment=null, creditCard=null, paysafecard=null, paypal=null, noBanks=null, channel=null, email=null, client_name=null, client_surname=null, accept_tos=true, style='default'){
    return dpay.generatePayment(this.service, this.secret, this.production, price, successURL, failURL, ipnURL, description, custom, installment, creditCard, paysafecard, paypal, noBanks, channel, email, client_name, client_surname, accept_tos, style);
  }
  getPaymentInfo(transactionID){
    return dpay.getPaymentInfo(this.service, this.secret, this.production, transactionID);
  }
}

class PayByLinkPSC{
  constructor(userID, shopID, pin){
    this.userID = userID;
    this.shopID = shopID;
    this.pin = pin;
  }
  generatePayment(price, returnSuccess, returnFail, notyficationURL, description=null){
    return pbl.pscPayment(this.userID, this.shopID, this.pin, price, returnSuccess, returnFail, notyficationURL, description);
  }
}

class PayByLink{
  constructor(shopID, hash){
    this.hash = hash;
    this.shopID = shopID;
  }
  generatePayment(price, control, description, email, returnSuccess, notyficationURL, customFinishNote){
    return pbl.bankTransfer(this.shopID, this.hash, price, control, description, email, notyficationURL, returnSuccess, customFinishNote);
  }

  generateIpnHash(request){
    return pbl.generateIpnHash(this.hash, request);
  }
}

class PayByLinkDB{
  constructor(login, password, hash){
    this.login = login;
    this.password = password;
    this.hash = hash;
  }
  generatePayment(price, description, control){
    return pbl.generateDBPayment(this.login, this.password, this.hash, price, description, control);
  }

  getPaymentInfo(clientURL){
    return pbl.getDBPaymentInfo(this.login, this.password, this.hash, clientURL);
  }
}
class PayByLinkSMS{
  constructor(userID, serviceID){
    this.userID = userID;
    this.serviceID = serviceID;
  }

  checkCode(number, code){
    return pbl.checkCode(this.userID, this.serviceID, number, code);
  }
}

class PayNow{
  constructor(apikey, signature, sandbox){
    this.apikey = apikey;
    this.signature = signature;
    this.sandbox = sandbox;
  }

  generatePayment(idemptency, amount, currency=null, externalId, description, continueUrl=null, email, firstName=null, lastName=null, locale=null, validityTime=null, paymentMethodId=null, authorizationCode=null){
    return paynow.generatePayment(this.apikey, this.signature, idemptency, this.sandbox, amount, currency, externalId, description, continueUrl, email, firstName, lastName, locale, validityTime, paymentMethodId, authorizationCode);
  }
  getPaymentInfo(paymentID){
    return paynow.getPaymentInfo(this.apikey, this.sandbox, paymentID);
  }
  getPaymentsMethods(){
    return paynow.getPaymentsMethods(this.apikey, this.sandbox);
  }
}

class Lvlup{
  constructor(apikey, sandbox){
    this.apikey = apikey;
    this.sandbox = sandbox;
  }

  generatePayment(amount, redirectUrl, webhookUrl){
    return lvlup.generatePayment(this.apikey, this.sandbox, amount, redirectUrl, webhookUrl);
  }
  getPaymentInfo(paymentID){
    return lvlup.getPaymentInfo(this.apikey, this.sandbox, paymentID);
  }
  getPaymentsList(){
    return lvlup.getPaymentsList(this.apikey, this.sandbox);
  }
  generateSandboxAccount(){
      return lvlup.generateSandboxAccount();
  }
  sandboxAcceptPayment(paymentID){
    lvlup.sandboxAcceptPayment(this.apikey, paymentID)
  }
}

class PayPal{
  constructor(clientID, clientSecret, sandbox){
    this.clientID = clientID;
    this.clientSecret = clientSecret;
    this.sandbox = sandbox;
  }
  generatePayment(returnOK, returnFail, itemName, itemPrice, description){
    return paypal.generatePayment(this.clientID, this.clientSecret, this.sandbox, returnOK, returnFail, itemName, parseFloat(itemPrice), description)
  }
  getPaymentInfo(paymentID){
    return paypal.getPaymentInfo(this.clientID, this.clientSecret, this.sandbox, paymentID);
  }
  verifyWebhookSignature(webhookId, headers, body){
    return paypal.verifyWebhookSignature(this.clientID, this.clientSecret, this.sandbox, webhookId, headers, body)
  }
  execute(paymentId, payerId){
    return paypal.execute(this.clientID, this.clientSecret, this.sandbox, paymentId, payerId)
  }
}

module.exports = { HotPay, HotPayPSC, HotPayDB, CashBill, MicroSMS, DPay, PayByLinkPSC, PayByLink, PayByLinkDB, PayByLinkSMS, PayNow, Lvlup, PayPal, HotPaySMS }