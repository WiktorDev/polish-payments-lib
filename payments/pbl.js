const querystring = require('query-string');
const crypto = require('crypto');
const { curly } = require('node-libcurl');
const { isNull, IsJsonString } = require('../utils/validator');
const { implode } = require('../utils/functions');

exports.generateDBPayment= async function generatePayment(login, password, hash, price, description, control){
    var params = {
        price: price*100,
        description: description,
        control: control
    }
    params.signature = crypto.createHash('sha256').update(implode('|', params)+'|'+hash).digest('hex');

    const { statusCode, data, headers } = await curly.post('https://paybylink.pl/direct-biling/', {
        HTTPHEADER: ['Content-Type: application/json'],
        postFields: JSON.stringify(params),
        USERPWD: `${login}:${password}`,
        SSL_VERIFYPEER: false
    })
    return JSON.parse(data);
}

exports.getDBPaymentInfo= async function getDBPaymentInfo(login, password, hash, clientURL){
    var pid = clientURL.replace('https://paybylink.pl/direct-biling/', '').replace('/', '')
    var params = {
        pid: pid,
        signature: crypto.createHash('sha256').update(`${pid}|${hash}`).digest('hex')
    }

    const { statusCode, data, headers } = await curly.post(`https://paybylink.pl/direct-biling/transactionStatus.php`, {
        HTTPHEADER: ['Content-Type: application/json'],
        postFields: JSON.stringify(params),
        USERPWD: `${login}:${password}`,
        SSL_VERIFYPEER: false
    })
    return JSON.parse(data);
}

exports.bankTransfer = async function bankTransfer(shopID, hash, price, control, description, email, notifyUrl, returnUrlSuccess, customFinishNote){
    var params = {
        shopId: shopID,
        price: price
    }
    if(!isNull(control)) params.control = control;
    if(!isNull(description)) params.description = description;
    if(!isNull(email)) params.email = email;
    if(!isNull(notifyUrl)) params.notifyURL = notifyUrl;
    if(!isNull(returnUrlSuccess)) params.returnUrlSuccess = returnUrlSuccess;
    if(!isNull(customFinishNote)) params.customFinishNote = customFinishNote;

    params.signature = crypto.createHash('sha256').update(hash+'|'+implode('|', params)).digest('hex');

    const { statusCode, data, headers } = await curly.post('https://secure.pbl.pl/api/v1/transfer/generate', {
        HTTPHEADER: ['Content-Type: application/json'],
        postFields: JSON.stringify(params),
        SSL_VERIFYPEER: false
    })
    return data;
}

exports.generateIpnHash=(hash, data)=>{
    var string = `${hash}|${data.transactionId}|${data.control}|${data.email}|${data.amountPaid}|${data.notificationAttempt}|${data.paymentType}|${data.apiVersion}`
    var signature = crypto.createHash('sha256').update(string).digest('hex');
    return signature;
}

exports.pscPayment = async function pscPayment(userID, shopID, pin, price, return_ok, return_fail, notify_url, control, description){
    var params = {
        userid: userID,
        shopid: shopID,
        amount: price,
        return_ok: return_ok,
        return_fail: return_fail,
        url: notify_url,
        control: control,
        get_pid: true
    }
    if(!isNull(description)) params.description = description;
    params.hash = crypto.createHash('sha256').update(userID+pin+price).digest('hex');

    const { statusCode, data, headers } = await curly.post('https://paybylink.pl/api/psc/', {
        postFields: querystring.stringify(params),
        SSL_VERIFYPEER: false
    })
    if(!IsJsonString(data)){
        throw new Error('Invalid parameters!')
    }
    if(JSON.parse(data).status == false){
        throw new Error('PayByLink returned error: ' + JSON.parse(data).message)
    }
    var pid = JSON.parse(data).pid;
    return { transactionID: pid, url: `https://paybylink.pl/pay/${pid}` }
}

exports.checkCode=async function checkCode(userid, serviceid, number, code){
    var params = querystring.stringify({ userid: userid, serviceid: serviceid, number: number, code: code})
    const { statusCode, data, headers } = await curly.get(`https://paybylink.pl/api/v2/index.php?${params}`, { SSL_VERIFYPEER: false })
    var payment;
    var used;
    var phone;
    var message;
    if(data.connect){
        phone = data.data.phone
        if(data.data.status == 1){
            payment = true
            used = false
        }else{
            payment = false;
            used = true;
        }
    }else{
        if(isNull(data.connect)){
            message = data.error.message
        }else{
            message = data.data.message
        }
    }
    if(message) throw new Error('PayByLink returned error: ' + message)
    var jsonResponse = { payed: payment, used: used, phone: phone }
    return jsonResponse
}