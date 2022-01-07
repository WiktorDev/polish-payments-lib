const querystring = require('query-string');
const crypto = require('crypto');
const { curly } = require('node-libcurl');
const { isNull, IsJsonString } = require('../../utils/validator');

exports.generatePayment = async function(service, secret, production, price, successURL, failURL, ipnURL, description, custom, installment, creditCard, paysafecard, paypal, noBanks, channel, email, client_name, client_surname, accept_tos, style){
    var string = `${service}|${secret}|${price}|${successURL}|${failURL}|${ipnURL}`;
    var hash = crypto.createHash('sha256').update(string).digest('hex');

    var params = {
        service: service,
        value: price,
        url_success: successURL,
        url_fail: failURL,
        url_ipn: ipnURL,
        checksum: hash
    }

    if(!isNull(description)) params.description = description;
    if(!isNull(custom)) params.custom = custom;
    if(!isNull(installment)) params.installment = installment;
    if(!isNull(creditCard)) params.creditcard = creditCard;
    if(!isNull(paysafecard)) params.paysafecard = paysafecard;
    if(!isNull(paypal)) params.paypal = paypal;
    if(!isNull(noBanks)) params.noBanks = noBanks;
    if(!isNull(channel)) params.channel = channel;
    if(!isNull(email)) params.email = email;
    if(!isNull(client_name)) params.client_name = client_name;
    if(!isNull(client_surname)) params.client_surname = client_surname;
    if(!isNull(accept_tos)) params.accept_tos = accept_tos;
    if(!isNull(style)) params.style = style;

    const { statusCode, data, headers } = await curly.post(`https://secure${production ? '' : '-test'}.dpay.pl/register/`, { postFields: JSON.stringify(params),  SSL_VERIFYPEER: false});
    if(!IsJsonString(data) || data.error == true){
        return `{ "status": false, "error": true, "msg": "${data.msg}", "transactionId": null }`
    }
    return data;
}

exports.getPaymentInfo = async function(service, secret, production, transactionID){
    var string = `${service}|${transactionID}|${secret}`;
    var hash = crypto.createHash('sha256').update(string).digest('hex');
    const { statusCode, data, headers } = await curly.post((production ? 'https://panel.dpay.pl/api/v1/pbl/details' : 'https://panel.digitalpayments.pl/api/v1/pbl/details'), {
        postFields: querystring.stringify({
            service: service,
            transaction_id: transactionID,
            checksum: hash
        }),
        SSL_VERIFYPEER: false
    });
    return data;
}