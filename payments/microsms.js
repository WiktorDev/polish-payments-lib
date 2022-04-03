const querystring = require('query-string');
const crypto = require('crypto');
const func = require('../utils/functions')
const validator = require('../utils/validator')
const logger = require('../utils/logger')
const axios = require('axios');

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
    var config = { method: 'get', url: `https://microsms.pl/psc/ips`};
    try {
        const response = await axios(config);
        if(!func.inArray(ip, response.data.split(','))) return false;
        return true;
    } catch (error) {
        return error.response.data
    }
}

exports.checkSMSCode=async function(code, userid, serviceid){
    var config = { method: 'get',  url: `https://microsms.pl/api/check_multi.php?userid=${userid}&code=${code}&serviceid=${serviceid}` };
    try {
        const response = await axios(config);
        if(validator.msmsValidateCode(code) == false){
            logger.error('The code does not match with regex.') 
            return false;
        }
        return func.microsmsCheckPaymentStatus(response.data)
    } catch (error) {
        return error.response.data
    }
}