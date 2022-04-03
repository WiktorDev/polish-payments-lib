const querystring = require('query-string');
const crypto = require('crypto');
const logger = require('../utils/logger');
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
        if(IsJsonString(response.data)){
            logger.error('Wystapil blad podczas generowania platnosci!')
            return `{ "STATUS": false, "WIADOMOSC": "ERROR", "URL": null }`
        }
        return response.data
    } catch (error) {
        return error.response.data
    }
}

exports.generatePSCPayment= async function generatePSCPayment(secret, password, price, name, redirect, id){
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
        url: 'https://psc.hotpay.pl/',
        data : data
    };
    try {
        const response = await axios(config);
        if(IsJsonString(response.data)){
            logger.error('Wystapil blad podczas generowania platnosci!')
            return `{ "STATUS": false, "WIADOMOSC": "ERROR", "URL": null }`
        }
        return response.data
    } catch (error) {
        return error.response.data
    }
}

exports.checkCode=async function checkCode(secret, code){
    var config = {
        method: 'get',
        url: `https://apiv2.hotpay.pl/v1/sms/sprawdz?sekret=${secret}&kod_sms=${code}`
    };
      
    try {
        const response = await axios(config);
        return response.data
    } catch (error) {
        return error.response.data
    }
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}