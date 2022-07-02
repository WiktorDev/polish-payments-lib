const axios = require('axios');

exports.generatePayment=async(clientID, clientSecret, sandbox, returnOK, returnFail, itemName, itemPrice, description)=>{
    var data = JSON.stringify({
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": returnOK,
            "cancel_url": returnFail
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": itemName,
                    "sku": "001",
                    "price": itemPrice,
                    "currency": "PLN",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "PLN",
                "total": itemPrice
            },
            "description": description
        }]
    });
    var config = {
        method: 'post',
        url: `${sandbox ? 'https://api-m.sandbox.paypal.com': 'https://api-m.paypal.com'}/v1/payments/payment`,
        auth: {
            username: clientID,
            password: clientSecret
        },
        headers: { 
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

exports.getPaymentInfo=async(clientID, clientSecret, sandbox, paymentID)=>{
    var config = {
        method: 'get',
        url: `${sandbox ? 'https://api-m.sandbox.paypal.com': 'https://api-m.paypal.com'}/v1/payments/payment/${paymentID}`,
        auth: {
            username: clientID,
            password: clientSecret
        }
    }
    try {
        const response = await axios(config);
        return response.data
    } catch (error) {
        return error.response.data
    }
}

exports.verifyWebhookSignature=async(clientID, clientSecret, sandbox, webhookId, headers, body)=>{
    let data = JSON.stringify({
        "auth_algo": headers['paypal-auth-algo'],
        "cert_url": headers['paypal-cert-url'],
        "transmission_id": headers['paypal-transmission-id'],
        "transmission_sig": headers['paypal-transmission-sig'],
        "transmission_time": headers['paypal-transmission-time'],
        "webhook_id": webhookId,
        "webhook_event": body
    });
    let config = {
        method: 'post',
        url: `${sandbox ? 'https://api-m.sandbox.paypal.com': 'https://api-m.paypal.com'}/v1/notifications/verify-webhook-signature`,
        auth: {
            username: clientID,
            password: clientSecret
        },
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    }
    try {
        const response = await axios(config);
        return response.data
    } catch (error) {
        return error.response.data
    }
}

exports.execute=async(clientID, clientSecret, sandbox, id, payerID)=>{
    let data = {
        payer_id: payerID
    }
    let config = {
        method: 'post',
        url: `${sandbox ? 'https://api-m.sandbox.paypal.com': 'https://api-m.paypal.com'}/v1/payments/payment/${id}/execute`,
        auth: {
            username: clientID,
            password: clientSecret
        },
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data)
    }
    try {
        const response = await axios(config);
        return response.data
    } catch (error) {
        return error.response.data
    }
}