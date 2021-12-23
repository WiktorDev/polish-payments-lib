const querystring = require('query-string');
const crypto = require('crypto');
const func = require('../../utils/functions')
const { curly } = require('node-libcurl');

exports.generatePayment=(userID, shopID, hash, amount, control = null, return_urlc = null, return_url = null, description = null)=>{
    var string = shopID+""+hash+""+amount;
    const signature = crypto.createHash('md5').update(string).digest('hex');

    var url = 'https://microsms.pl/api/bankTransfer/?';
    var query = querystring.stringify({
        shopid: shopID,
        signature: signature,
        amount: amount,
        control: control,
        return_urlc: return_urlc,
        return_url: return_url,
        description: description
    })
    return url+query;
}

exports.checkIP=async function checkIP(ip){
    const { statusCode, data, headers } = await curly.get('https://microsms.pl/psc/ips', { SSL_VERIFYPEER: false })
    
    if(!func.inArray(ip, data.split(','))) return false;
    return true;
}