const querystring = require('query-string');
const crypto = require('crypto');
const { curly } = require('node-libcurl');

exports.generatePayment= async function generatePayment(amount, redirectURL, webhookURL, apikey){
    const { statusCode, data, headers } = await curly.post(`https://api.lvlup.pro/v4/wallet/up`, {
        postFields: querystring.stringify({
            amount: amount,
            redirectUrl: redirectURL,
            webhookUrl: webhookURL
        }),
        httpHeader: [
            `Authorization: Bearer ${apikey}`
        ],
        SSL_VERIFYPEER: false,
        CUSTOMREQUEST: "POST"
    })
    
    return data;
    
}

this.generatePayment(1, 'https://cos.pl', 'https://s.pl', 'HAtkqBEYLIrMKrkwMGJFtCyaoLPpjVQs').then((data)=>{
    console.log(Buffer.from(data))
})