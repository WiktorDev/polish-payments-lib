const querystring = require('query-string');
const crypto = require('crypto');
const { curly } = require('node-libcurl');

exports.generatePayment= async function generatePayment(title, amount, currency, secretPhrase, shopId, url){
    var string = title+""+amount+""+currency+""+secretPhrase
    const hash = crypto.createHash('sha1').update(string).digest('hex');

    const { statusCode, data, headers } = await curly.post(`${url}/payment/${shopId}`, {
        postFields: querystring.stringify({
            title: title,
            "amount.value": amount,
            "amount.currencyCode": currency,
            sign: hash
        }),
        SSL_VERIFYPEER: false,
        CUSTOMREQUEST: "POST"
    })
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