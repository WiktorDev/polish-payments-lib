const querystring = require('query-string');
const crypto = require('crypto');
const { implode, isNull } = require('../utils/functions');
const axios = require('axios');

exports.generateDBPayment= async function generatePayment(login, password, hash, price, description, control){
    var data = {
        price: price*100,
        description: description,
        control: control
    };

    data.signature = crypto.createHash('sha256').update(implode('|', data)+'|'+hash).digest('hex');

    var config = {
        method: 'post',
        url: 'https://paybylink.pl/direct-biling/',
        auth: {
            username: login,
            password: password
        },
        headers: { 'Content-Type': 'application/json',},
        data: JSON.stringify(data)
    };

    try {
        const response = await axios(config);
        return response.data
    } catch (error) {
        return error.response.data
    }
}

exports.getDBPaymentInfo= async function getDBPaymentInfo(login, password, hash, clientURL){
    var pid = clientURL.replace('https://paybylink.pl/direct-biling/', '').replace('/', '')
    var params = {
        pid: pid,
        signature: crypto.createHash('sha256').update(`${pid}|${hash}`).digest('hex')
    }

    var config = {
        method: 'post',
        url: 'https://paybylink.pl/direct-biling/transactionStatus.php',
        auth: {
            username: login,
            password: password
        },
        headers: { 'Content-Type': 'application/json'},
        data: JSON.stringify(params)
    };

    try {
        const response = await axios(config);
        return response.data
    } catch (error) {
        return error.response.data
    }
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

    var config = {
        method: 'post',
        url: 'https://secure.pbl.pl/api/v1/transfer/generate',
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify(params)
    };
    try {
        const response = await axios(config);
        return response.data
    } catch (error) {
        return error.response.data
    }
}

exports.generateIpnHash=(hash, data)=>{
    var string = `${hash}|${data.transactionId}|${data.control}|${data.email}|${data.amountPaid}|${data.notificationAttempt}|${data.paymentType}|${data.apiVersion}`
    return crypto.createHash('sha256').update(string).digest('hex');
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
    };

    if(!isNull(description)) params.description = description;
    params.hash = crypto.createHash('sha256').update(userID+pin+price).digest('hex');

    var config = {
        method: 'post',
        url: 'https://paybylink.pl/api/psc/',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: querystring.stringify(params)
    };

    try {
        const response = await axios(config);
        if(JSON.parse(response.data).status == false){
            throw new Error('PayByLink returned error: ' + JSON.parse(data).message)
        }
        var pid = JSON.parse(response.data).pid;
        return { transactionID: pid, url: `https://paybylink.pl/pay/${pid}` }
    } catch (error) {
        return error.response.data
    }
}

exports.checkCode=async function checkCode(userid, serviceid, number, code){
    var params = querystring.stringify({ userid: userid, serviceid: serviceid, number: number, code: code})

    var config = {
        method: 'get',
        url: `https://paybylink.pl/api/v2/index.php?${params}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }

    try {
        const response = await axios(config);
        var data = response.data
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
    } catch (error) {
        return error.response
    }
}