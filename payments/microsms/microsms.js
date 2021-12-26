const querystring = require('query-string');
const crypto = require('crypto');
const func = require('../../utils/functions')
const { curly } = require('node-libcurl');
const config = require('./config.json')
const validator = require('../../utils/validator')
const logger = require('../../utils/logger')

exports.generatePayment=(userID, shopID, hash, amount, control = null, return_urlc = null, return_url = null, description = null)=>{
    var string = shopID+""+hash+""+amount;
    const signature = crypto.createHash('md5').update(string).digest('hex');

    var query = querystring.stringify({
        shopid: shopID,
        signature: signature,
        amount: amount,
        control: control,
        return_urlc: return_urlc,
        return_url: return_url,
        description: description
    })
    return config.BANK_TRANSFER+query;
}

exports.checkIP=async function checkIP(ip){
    const { statusCode, data, headers } = await curly.get(config.CHECK_IPS, { SSL_VERIFYPEER: false })
    if(!func.inArray(ip, data.split(','))) return false;
    return true;
}

exports.checkSMSCode=async function(code, userid, serviceid){
    const { statusCode, data, headers } = await curly.get(`${config.CHECK_SMS}?userid=${userid}&code=${code}&serviceid=${serviceid}`, { SSL_VERIFYPEER: false });
    if(validator.msmsValidateCode(code) == false){
        logger.error('The code does not match with regex.') 
        return false;
    }
    return func.microsmsCheckPaymentStatus(data)
}