const crypto = require('crypto');
const { isNull } = require('../utils/validator');
const { implode } = require('../utils/functions')
const axios = require('axios');
const qs = require('qs');

exports.generatePayment= async function generatePayment(secretPhrase, shopId, url, title, amount, currency, description, additionalData, paymentChannel, languageCode, firstName, surname, email){
    var params = {
        title: title,
        'amount.value': amount,
        'amount.currencyCode': currency
    };

    if(!isNull(description)) params.description = description;
    if(!isNull(additionalData)) params.additionalData = additionalData;
    if(!isNull(paymentChannel)) params.paymentChannel = paymentChannel;
    if(!isNull(languageCode)) params.languageCode = languageCode;
    if(!isNull(firstName)) params['personalData.firstName'] = firstName;
    if(!isNull(surname)) params['personalData.surname'] = surname;
    if(!isNull(email)) params['personalData.email'] = email;

    params.sign = crypto.createHash('sha1').update(implode('', params)+secretPhrase).digest('hex');

    var config = {
        method: 'post',
        url: `${url}/payment/${shopId}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(params)
    };
    
    try {
        const response = await axios(config);
        return response.data
    } catch (error) {
        return error.response.data
    }
}

exports.setRedirectURLS= async function setRedirectURLS(orderId, returnUrl, negativeReturnUrl, secretPhrase, shopId, url){
    var string = orderId+""+returnUrl+""+negativeReturnUrl+""+secretPhrase
    const hash = crypto.createHash('sha1').update(string).digest('hex');

    var data = qs.stringify({
        returnUrl: returnUrl,
        negativeReturnUrl: negativeReturnUrl,
        sign: hash
    });
    var config = {
        method: 'put',
        url: `${url}/payment/${shopId}/${orderId}`,
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };

    try {
        const response = await axios(config);
        return response.data
    } catch (error) {
        return error.response.data
    }
}

exports.getPaymentInfo = async function getPaymentInfo(orderId, secretPhrase, shopId, url){
    var string = orderId+""+secretPhrase
    const hash = crypto.createHash('sha1').update(string).digest('hex');

    var config = {
        method: 'get',
        url: `${url}/payment/${shopId}/${orderId}?sign=${hash}`
    };

    try {
        const response = await axios(config);
        return response.data
    } catch (error) {
        return error.response.data
    }
}