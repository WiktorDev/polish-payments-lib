const fetch = require('node-fetch')
const querystring = require('query-string');

async function test(amount, redirectUrl, webhookUrl){
    const body = {amount, redirectUrl, webhookUrl};

    const options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer HAtkqBEYLIrMKrkwMGJFtCyaoLPpjVQs`
        },
    };

    const res = await fetch(`https://api.lvlup.pro/v4/wallet/up`, options);
    if(res.status !== 200) return {statusCode: res.status, statusText: res.statusText, source: `https://api.lvlup.pro/v4/wallet/up`};

    try {
        json = await res.json();
    } catch {
        return {statusCode: res.status, statusText: res.statusText, source: `${url}${path}`};
    }

    json.statusCode = res.status;
    json.statusText = res.statusText;
    json.source = `${url}${path}`;
    return json;
}


test('32', 'https://example.site/redirect', 'https://example.site/webhook').then((data)=>{
    console.log(data)
})

/**exports.generatePayment= async function generatePayment(amount, redirectURL, webhookURL, apikey){
    const { data } = await curly.post(`https://api.lvlup.pro/v4/wallet/up`, {
        postFields: querystring.stringify({
            amount: amount,
            redirectUrl: redirectURL,
            webhookUrl: webhookURL
        }),
        httpHeader: [
            'Content-Type: application/json',
            'Accept: application/json',
            `Authorization: Bearer ${apikey}`
        ],
        SSL_VERIFYPEER: false
    })
    
    return data;
    
}

this.generatePayment(1, 'https://cos.pl', 'https://s.pl', 'HAtkqBEYLIrMKrkwMGJFtCyaoLPpjVQs').then((data)=>{
    console.log(data)
})**/