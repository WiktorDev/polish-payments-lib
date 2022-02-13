const querystring = require('query-string');
const crypto = require('crypto');
const logger = require('../utils/logger');
const { curly } = require('node-libcurl');
const axios = require('axios');

exports.generatePayment=async function(secret, password, price, name, redirect, id){
    var string = password+";"+price+";"+name+";"+redirect+";"+id+";"+secret;
    const hash = crypto.createHash('sha256').update(string).digest('hex');

    var data = querystring.stringify({
        SEKRET: secret,
        KWOTA: price,
        NAZWA_USLUGI: name,
        ADRES_WWW: redirect,
        ID_ZAMOWIENIA: id,
        EMAIL: "",
        DANE_OSOBOWE: "",
        TYP: "INIT",
        HASH: hash
    });

    var config = {
        method: 'post',
        url: 'https://platnosc.hotpay.pl/',
        data : data
    };
    try {
        const response = await axios(config);
        return response.data
    } catch (error) {
        return error.response.data
    }
}

exports.generatePaymentOLD= async function generatePaymentOLD(secret, password, price, name, redirect, id){
    _price = price;
    var string = password+";"+price+";"+name+";"+redirect+";"+id+";"+secret;
    const hash = crypto.createHash('sha256').update(string).digest('hex');

    _query = querystring.stringify({ SEKRET: secret, KWOTA: price, NAZWA_USLUGI: name, ADRES_WWW: redirect, ID_ZAMOWIENIA: id, EMAIL: "", DANE_OSOBOWE: ""})

    const { statusCode, data, headers } = await curly.post('https://platnosc.hotpay.pl/', {
        postFields: querystring.stringify({
            SEKRET: secret,
            KWOTA: price,
            NAZWA_USLUGI: name,
            ADRES_WWW: redirect,
            ID_ZAMOWIENIA: id,
            EMAIL: "",
            DANE_OSOBOWE: "",
            TYP: "INIT",
            HASH: hash
        }),
        SSL_VERIFYPEER: false,
        CUSTOMREQUEST: "POST"
    })

    return data;
}

exports.generatePSCPayment= async function generatePSCPayment(secret, password, price, name, redirect, id){
    var string = password+";"+price+";"+name+";"+redirect+";"+id+";"+secret;
    const hash = crypto.createHash('sha256').update(string).digest('hex');

    const { statusCode, data, headers } = await curly.post('https://psc.hotpay.pl/', {
        postFields: querystring.stringify({
            SEKRET: secret,
            KWOTA: price,
            NAZWA_USLUGI: name,
            ADRES_WWW: redirect,
            ID_ZAMOWIENIA: id,
            EMAIL: "",
            DANE_OSOBOWE: "",
            TYP: "INIT",
            HASH: hash
        }),
        SSL_VERIFYPEER: false,
        CUSTOMREQUEST: "POST"
    })
    
    if(!IsJsonString(data)){
        logger.error('Wystapil blad podczas generowania platnosci!')
        return `{ "STATUS": false, "WIADOMOSC": "ERROR", "URL": null }`
    }

    return data;
}

exports.checkCode=async function checkCode(secret, code){
    const { statusCode, data, headers } = await curly.get(`https://apiv2.hotpay.pl/v1/sms/sprawdz?sekret=${secret}&kod_sms=${code}`, { SSL_VERIFYPEER: false })
    console.log(data)
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

//this.checkCode('SzdNcy9kcTlCZVN1Ny9ZemlzUFBpSXQzT0lhcHpmb2l2cnFpN1Q2ZHZIST0,', 'dsf5421f')
