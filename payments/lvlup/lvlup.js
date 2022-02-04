const axios = require('axios');
const logger = require('../../utils/logger');

exports.generatePayment= async function(apikey, sandbox, amount, redirectUrl, webhookUrl){
    var data = {
        "amount": amount,
        "redirectUrl": redirectUrl,
        "webhookUrl": webhookUrl
    };

    var config = {
        method: 'post',
        url: `${sandbox ? 'https://api.sandbox.lvlup.pro' : 'https://api.lvlup.pro'}/v4/wallet/up`,
        headers: { 
          'Authorization': `Bearer ${apikey}`, 
          'Content-Type': 'application/json'
        },
        data: data
    };
    try {
        const response = await axios(config);
        return response.data
    } catch (error) {
        return error.response.data
    }
}

exports.getPaymentInfo=async function(apikey, sandbox, paymentID){
    var config = {
      method: 'get',
      url: `${sandbox ? 'https://api.sandbox.lvlup.pro' : 'https://api.lvlup.pro'}/v4/wallet/up/${paymentID}`,
      headers: { 
        'Authorization': `Bearer ${apikey}`
      }
    };
    
    try {
        const response = await axios(config);
        return response.data
    } catch (error) {
        return error.response.data
    }
}

exports.getPaymentsList=async function(apikey, sandbox){
    var config = {
        method: 'get',
        url: `${sandbox ? 'https://api.sandbox.lvlup.pro' : 'https://api.lvlup.pro'}/v4/payments`,
        headers: { 'Authorization': `Bearer ${apikey}` }
    };
    try {
        const response = await axios(config);
        return response.data
    } catch (error) {
        return error.response.data
    }
}

exports.generateSandboxAccount=async function(){
    var config = { method: 'post', url: 'https://api.sandbox.lvlup.pro/v4/sandbox/account/new' };

    try {
        const response = await axios(config);
        return response.data
    } catch (error) {
        return error.response.data
    }
}

exports.sandboxAcceptPayment=(apikey, paymentID)=>{
    var config = {
        method: 'post',
        url: `https://api.sandbox.lvlup.pro/v4/sandbox/wallet/up/${paymentID}/ok`,
        headers: { 
          'Authorization': `Bearer ${apikey}`
        }
    };
    axios(config).then(function (response) {
        console.log(JSON.stringify(response.data));
    }).catch(function(){
        logger.info('The payment has been confirmed successfully!')
    });
}