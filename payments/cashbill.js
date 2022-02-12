const querystring = require('query-string');
const crypto = require('crypto');
const { curly } = require('node-libcurl');
const { isNull } = require('../utils/validator');
const { implode } = require('../utils/functions')

exports.generatePayment= async function generatePayment(secretPhrase, shopId, url, title, amount, currency, description, additionalData, paymentChannel, languageCode, firstName, surname, email){
    var params = {
        title: title,
        "amount.value": amount,
        "amount.currencyCode": currency
    }

    if(!isNull(description)) params.description = description;
    if(!isNull(additionalData)) params.additionalData = additionalData;
    if(!isNull(paymentChannel)) params.paymentChannel = paymentChannel;
    if(!isNull(languageCode)) params.languageCode = languageCode;
    if(!isNull(firstName)) params['personalData.firstName'] = firstName;
    if(!isNull(surname)) params['personalData.surname'] = surname;
    if(!isNull(email)) params['personalData.email'] = email;
    
    params.sign = crypto.createHash('sha1').update(implode('', params)+secretPhrase).digest('hex');

    const { statusCode, data, headers } = await curly.post(`${url}/payment/${shopId}`, { postFields: querystring.stringify(params), SSL_VERIFYPEER: false })
    return data;
}

exports.setRedirectURLS= async function setRedirectURLS(orderId, returnUrl, negativeReturnUrl, secretPhrase, shopId, url){
    var string = orderId+""+returnUrl+""+negativeReturnUrl+""+secretPhrase
    const hash = crypto.createHash('sha1').update(string).digest('hex');
    await curly.put(`${url}/payment/${shopId}/${orderId}`, {
        postFields: querystring.stringify({
            returnUrl: returnUrl,
            negativeReturnUrl: negativeReturnUrl,
            sign: hash
        }),
        SSL_VERIFYPEER: false,
        CUSTOMREQUEST: "PUT"
    })
}

exports.getPaymentInfo = async function getPaymentInfo(orderId, secretPhrase, shopId, url){
    var string = orderId+""+secretPhrase
    const hash = crypto.createHash('sha1').update(string).digest('hex');

    const { statusCode, data, headers } = await curly.get(`${url}/payment/${shopId}/${orderId}?sign=${hash}`, {
        SSL_VERIFYPEER: false,
        CUSTOMREQUEST: "GET"
    })

    return data;
}