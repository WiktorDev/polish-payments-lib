const querystring = require('query-string');
const crypto = require('crypto');
const logger = require('../../utils/logger');
const { curly } = require('node-libcurl');
const config = require('./config.json')

var _query;

exports.getQuery=()=>{
    var query = config.PAYMENT_URL+"?"+_query;
    return query;
}

exports.generatePayment= async function generatePayment(secret, password, price, name, redirect, id){
    _price = price;
    var string = password+";"+price+";"+name+";"+redirect+";"+id+";"+secret;
    const hash = crypto.createHash('sha256').update(string).digest('hex');

    _query = querystring.stringify({ SEKRET: secret, KWOTA: price, NAZWA_USLUGI: name, ADRES_WWW: redirect, ID_ZAMOWIENIA: id, EMAIL: "", DANE_OSOBOWE: ""})

    const { statusCode, data, headers } = await curly.post(config.PAYMENT_URL, {
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

exports.generatePSCPayment=(secret, price, name, redirect, id)=>{
    var query = querystring.stringify({
        SEKRET: secret,
        KWOTA: price,
        NAZWA_USLUGI: name,
        ADRES_WWW: redirect,
        ID_ZAMOWIENIA: id,
        EMAIL: "",
        DANE_OSOBOWE: ""
    });
    var url = config.PSC_PAYMENT_URL+"?"+query
    return url;
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}