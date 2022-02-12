const { isNull } = require('../utils/validator');
const { implode, ksort } = require('../utils/functions')
const crypto = require('crypto');
const querystring = require('query-string');

exports.generatePayment= async function(shopId, pin, sandbox, amount, description, currency, lang, url, urlc, control, channel_groups, ignore_last_payment_channel, channel, ch_lock, type, button_text, bylaw, personal_data, expiration_date, firstname, surname, email, street, street_n1, street_n2, state, addr3, city, postcode, phone, country, p_info, p_email, customer, deladdr, blik_code, gp_token, ap_token){
    var params = {
        api_version: 'next',
        id: shopId,
        amount: amount,
        currency: currency,
        description: description,
        lang: lang
    }

    if (!isNull(channel)) params.channel = channel;
    if (!isNull(ch_lock)) params.ch_lock = ch_lock;
    if (!isNull(ignore_last_payment_channel)) params.ignore_last_payment_channel = ignore_last_payment_channel;
    if (!isNull(channel_groups)) params.channel_groups = channel_groups;
    if (!isNull(url)) params.url = url;
    if (!isNull(type)) params.type = type;
    if (!isNull(button_text)) params.buttontext = button_text;
    if (!isNull(bylaw)) params.bylaw = bylaw;
    if (!isNull(personal_data)) params.personal_data = personal_data;
    if (!isNull(urlc)) params.urlc = urlc;
    if (!isNull(expiration_date)) params.expiration_date = expiration_date;
    if (!isNull(control)) params.control = control;
    if (!isNull(firstname)) params.firstname = firstname;
    if (!isNull(surname)) params.lastname= surname;
    if (!isNull(email)) params.email = email;
    if (!isNull(blik_code)) params.blik_code = blik_code;
    if (!isNull(street)) params.street = street;
    if (!isNull(street_n1)) params.street_n1 = street_n1;
    if (!isNull(street_n2)) params.street_n2 = street_n2;
    if (!isNull(state)) params.state= state;
    if (!isNull(addr3)) params.addr3 = addr3;
    if (!isNull(city)) params.city= city;
    if (!isNull(postcode)) params.postcode = postcode;
    if (!isNull(phone)) params.phone = phone;
    if (!isNull(country)) params.country = country;
    if (!isNull(customer)) params.customer = customer;
    if (!isNull(deladdr))params.deladdr = deladdr;
    if (!isNull(p_info)) params.p_info = p_info;
    if (!isNull(p_email)) params.p_email = p_email;
    if (!isNull(gp_token)) params.gp_token = gp_token;
    if (!isNull(ap_token)) params.ap_token = ap_token;

    for(var element in params){
        element = params[element];
    }

    params.chk = generateChk(params, pin);
    console.log(generateChk(params, pin))
    //console.log(`https://ssl.dotpay.pl/test_payment/${querystring.stringify(params)}`)
}

function generateChk(params, pin){
    ksort(params);
    params.paramsList = implode(';', Object.keys(params));
    ksort(params);
    return crypto.createHmac('sha256', pin).update(JSON.stringify(params)).digest().toString('hex');
}

this.generatePayment('751632', 'uLd6E6VllwNVym7evi7OIk1QKGnIPqNn', true, '10.41', "test", "PLN", "pl")