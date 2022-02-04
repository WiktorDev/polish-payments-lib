const querystring = require('query-string');
const crypto = require('crypto');
const { curly } = require('node-libcurl');

exports.checkSMSCode = async function(code, number, serviceID, secret, key){
    var params = {
            api: key,
            secret: secret,
            service_id: serviceID,
            code: code

    }
    const { statusCode, data, headers } = await curly.post('https://simpay.pl/api/status', {
        postFields: JSON.stringify({ params: { params }}),
        FAILONERROR: true,
        SSL_VERIFYPEER: false,
        CUSTOMREQUEST: "POST"
    });
    console.log(JSON.parse(data))
}

this.checkSMSCode('test', 77777, '3552', '4PgrJeZkfnh8itxWBp25GuR3zqTEIOyS', 'XaJq7U8A')

exports.generateDirectBillingPayment = async function(control, amount, complete, failure, provider, serviceID, apiKey){
    var string = serviceID+amount+control+apiKey;
    var hash = crypto.createHash('sha256').update(string).digest('hex');

    const { statusCode, data, headers } = await curly.post('https://simpay.pl/db/api', {
        postFields: querystring.stringify({
            serviceId: serviceID,
            control: control,
            amount: amount,
            complete: complete,
            failure: failure,
            provider: provider,
            sign: hash
        }),
        FAILONERROR: true,
        SSL_VERIFYPEER: false,
        CUSTOMREQUEST: "POST"
    });
    return data
}