# polish-payments-lib
Polish Payments Providers nodejs library

### Supported payment operators:

* HotPay
* CashBill
* MicroSMS
* DPay
* PayByLink

### Installation
```bash
npm install polish-payments-lib
```

#### Bank transfer

* HotPay bank transfer and PayPal

###### Generate payment

```javascript
const Payment = require('polish-payments-lib');
const hpay = new Payment.HotPay('HotPay secret', 'Notyfication password');

hpay.generatePayment(price, 'Product name', 'Redirect URL', 'paymentID').then((data)=>{
    console.log(JSON.parse(data).URL)
});
```
###### Generate signature to notification in express.js (HotPay and HotPayPSC)

```javascript
const express = require('express')
const bodyParser = require('body-parser');
const crypto = require('crypto')
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', (req, res)=>{
    var notyficationPassword = 'Your notyfication password';
    var string = notyficationPassword+";"+req.body.KWOTA+";"+req.body.ID_PLATNOSCI+";"+req.body.ID_ZAMOWIENIA+";"+req.body.STATUS+";"+req.body.SECURE+";"+req.body.SEKRET;
    const hash = crypto.createHash('sha256').update(string).digest('hex');
    if(hash == req.body.HASH){
        switch(req.body.STATUS){
            case "SUCCESS":
                res.send('SUCCESS')
                break;
            case "FAILURE":
                res.send("FAILURE")
                break;
            case "PENDING":
                res.send("PENDING")
                break;
        }
    }
})

app.listen(3000, ()=>{
    console.log('3000')
})
```

* CashBill Bank Transfer

###### Generate payment

```javascript
const Payment = require('polish-payments-lib');
const cashbill = new Payment.CashBill('Secret key', 'ShopID', `(production true/false)`);

/**
 * Optional: description (string), additionalData(String), paymentChannel(String), languageCode(String), firstName(String), surname(String), email(String)
 * For more info visit CashBill docs (https://www.cashbill.pl/download/dokumentacje/P%C5%82atno%C5%9Bci/P%C5%82atno%C5%9Bci%20CashBill%232.4.pdf)
*/
cashbill.generatePayment('Product name', 'price', 'currency').then((data)=>{
    var id = data.id;
    var paymentURL = data.redirectUrl;
})
```

###### Get payment info

```javascript
const Payment = require('polish-payments-lib');
const cashbill = new Payment.CashBill('Secret key', 'ShopID', true/false);

cashbill.getPaymentInfo('Payment ID').then((data)=>{
    console.log(data)
})
```

###### Set redirect urls

```javascript
const Payment = require('polish-payments-lib');
const cashbill = new Payment.CashBill('Secret key', 'ShopID', true/false);

cashbill.setRedirectURLS('Payment ID', 'Redirect URL', 'Negative redirect url');
```

* MicroSMS Bank Transfer

###### Generate payment

```javascript
const Payment = require('polish-payments-lib');
const microsms = new Payment.MicroSMS('user id', 'shop id')

var paymentURL = microsms.generatePayment('price', 'hash', 'control (optional)', 'returl_urlc (optional)', 'return_url (optional)', 'description (optional)');
console.log(paymentURL);
```

###### Check IP

```javascript
const Payment = require('polish-payments-lib');
const microsms = new Payment.MicroSMS('user id', 'shop id')

microsms.checkIP('ip').then((data)=>{
    console.log(data) //Return true/false
});
```

* DPay Bank Transfer

###### Generate payment

```javascript
const Payment = require('polish-payments-lib');
const dpay = new Payment.DPay('service', 'secret', 'production true/false');

/**
 * Optional: description(string), custom(string), installment(boolean), creditCard(boolean), paysafecard(boolean), paypal(boolean), noBanks(boolean), channel(string), email(string), client_name(string), client_surname(string), accept_tos(boolean), style('default', 'dark', 'orange')
 * For more info visit Dpay docs (https://docs.dpay.pl/#operation/registerPayment)
*/
dpay.generatePayment('price', 'successURL', 'failfail', 'ipnURL').then((data)=>{
    console.log(JSON.parse(data))
})
```

###### Get payment info

```javascript
const Payment = require('polish-payments-lib');
const dpay = new Payment.DPay('service', 'secret', 'production true/false');

dpay.getPaymentInfo('transactionID').then((data)=>{
    console.log(data)
})
```

* PayByLink Transfer

###### Generate payment

```javascript
const Payment = require('polish-payments-lib')
const pbl = new Payment.PayByLink('shopID (int)', 'hash');
/**
 * For more info visit PayByLink docs (https://paybylink.pl/dokumentacja-przelewy.pdf)
*/
pbl.generatePayment('price (float)', '?control', '?description', '?email', '?returnSuccess', '?notyficationURL', '?customFinishNote').then((data)=>{
    console.log(data)
})
```

###### Receiving notification in express.js

```javascript
const Payment = require('polish-payments-lib')
const pbl = new Payment.PayByLink('shopID (int)', 'hash');

app.use(bodyParser.json());
app.post('/', (req, res)=>{
    var ipnHash = pbl.generateIpnHash(req.body)
    console.log(`Received ${req.method} request!`)
    if(ipnHash == req.body.signature){
        console.log(`Payment ID: ${req.body.transactionId}`)
        res.set('Content-Type', 'text/plain');
        return res.status(200).send("OK");
    }
})
```

#### SMS

* MicroSMS SMS

###### Check SMS code

```javascript
const Payment = require('polish-payments-lib');
const microsms = new Payment.MicroSMS('user id', 'shop id')

microsms.checkSMSCode('SMS code').then((data)=>{
    console.log(data) //Return true/false
});
```
#### PaySafeCard

* PayByLink PSC

###### Generate payment link

```javascript
const Payment = require('polish-payments-lib');
const pbl = new Payment.PayByLinkPSC(userID (int), serviceID (int), 'pin (string)');

pbl.generatePayment('price', 'returnSuccess', 'returnFail', 'notyficationURL', 'control', 'description (optional)').then((data)=>{
    console.log(data.transactionID) //Get transaction ID
    console.log(data.url) //Get payment url
})
```

* HotPay PaySafeCard

###### Generate payment

```javascript
const Payment = require('polish-payments-lib')
const hpay = new Payment.HotPayPSC('HotPay secret', 'Notyfication password')

hpay.generatePayment(price, 'Product name', 'Redirect URL', 'paymentID').then((data)=>{
    console.log(JSON.parse(data).URL)
})
```

#### DirectBilling

* PayByLink DirectBilling

###### Generate payment

```javascript
const Payment = require('polish-payments-lib')
const pbl = new Payment.PayByLinkDB('login', 'password', 'hash')

pbl.generatePayment(price, 'description', 'control').then((data)=>{
    console.log(data)
})
pbl.getPaymentInfo('https://paybylink.pl/direct-biling/db-1643362990_9071747/').then((res)=>{
    console.log(res)
})
```
###### Get Payment info

```javascript
const Payment = require('polish-payments-lib')
const pbl = new Payment.PayByLinkDB('login', 'password', 'hash')

pbl.getPaymentInfo('paymentURL').then((res)=>{
    console.log(res)
})
```
## Help

For help, contact me on Discord: [wiktor#8880](https://discord.com/users/643819423248941068) or [Discord server](https://discord.gg/VFFf7hYfhj)