const axios = require('axios');
const { isNull } = require('../../utils/validator');
const crypto = require('crypto')

exports.generatePayment = async function(apikey, signature, idempotency, sandbox, amount, currency, externalId, description, continueUrl, email, firstName, lastName, locale, validityTime, paymentMethodId, authorizationCode){
  var data = {
    "amount": amount,
    "externalId": externalId,
    "description": description,
    "buyer": {
      "email": email
    }
  };

  if(!isNull(currency))data.currency = currency;
  if(!isNull(continueUrl))data.continueUrl = continueUrl;
  if(!isNull(firstName))data['buyer.firstName']=firstName;
  if(!isNull(lastName))data['buyer.lastName']=lastName;
  if(!isNull(locale))data['buyer.locale']=locale;
  if(!isNull(validityTime))data.validityTime = validityTime;
  if(!isNull(paymentMethodId))data.paymentMethodId = paymentMethodId;
  if(!isNull(authorizationCode))data.authorizationCode = authorizationCode;

  var hmacSignature = crypto.createHmac('sha256', signature).update(JSON.stringify(data)).digest().toString('base64');

  var config = {
    method: 'post',
    url: sandbox ? 'https://api.sandbox.paynow.pl/v1/payments' : 'https://api.paynow.pl/v1/payments',
    headers: { 
      'Signature': hmacSignature, 
      'Idempotency-Key': idempotency, 
      'Api-Key': apikey, 
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(data)
  };
  const response = await axios(config);
  return response.data;
}

exports.getPaymentInfo=async function(apikey, sandbox, paymentID){
  var config = {
    method: 'get',
    url: `${sandbox ? 'https://api.sandbox.paynow.pl' : 'https://api.paynow.pl'}/v1/payments/${paymentID}/status`,
    headers: { 
      'Api-Key': `${apikey}`
    }
  };
  
  try {
    const response = await axios(config);
    return response.data
  } catch (error) {
    return error.response.data
  }
}

exports.getPaymentsMethods=async function(apikey, sandbox){
  var config = {
    method: 'get',
    url: `${sandbox ? 'https://api.sandbox.paynow.pl' : 'https://api.paynow.pl'}/v2/payments/paymentmethods`,
    headers: { 
      'Api-Key': apikey
    }
  };
  
  try {
    const response = await axios(config);
    return response.data
  } catch (error) {
    return error.response.data
  }
}
