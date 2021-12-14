const hotpay = require('./payments/hotpay/hotpay');
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
    const data = hotpay.generatePSCPayment(this.secret, price, service_name, redirect, order_id)
    this.generated = true;
    return data;
  }
}

module.exports = { HotPay, HotPayPSC }