const querystring = require('query-string');
const crypto = require('crypto');
const func = require('../utils/functions')
const { curly } = require('node-libcurl');
const validator = require('../utils/validator')
const logger = require('../utils/logger')

exports.generatePayment=(userID, shopID, hash, amount, control = null, return_urlc = null, return_url = null, description = null)=>{
    var string = shopID+""+hash+""+amount;
    const signature = crypto.createHash('sha256').update(string).digest('hex');

    var query = querystring.stringify({
        shopid: shopID,
        signature: signature,
        amount: amount,
        control: control,
        return_urlc: return_urlc,
        return_url: return_url,
        description: description
    })
    return 'https://microsms.pl/api/bankTransfer/?'+query;
}

exports.checkIP=async function checkIP(ip){
    const { statusCode, data, headers } = await curly.get('https://microsms.pl/psc/ips', { SSL_VERIFYPEER: false })
    if(!func.inArray(ip, data.split(','))) return false;
    return true;
}

exports.checkSMSCode=async function(code, userid, serviceid){
    const { statusCode, data, headers } = await curly.get(`https://microsms.pl/api/check_multi.php?userid=${userid}&code=${code}&serviceid=${serviceid}`, { SSL_VERIFYPEER: false });
    if(validator.msmsValidateCode(code) == false){
        logger.error('The code does not match with regex.') 
        return false;
    }
    return func.microsmsCheckPaymentStatus(data)
}