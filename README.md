# polish-payments-lib
Polish Payments Providers nodejs library

### Supported payment operators:

* HotPay
* CashBill
* MicroSMS

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
* HotPay PaySafeCard

###### Generate payment

```javascript
const Payment = require('polish-payments-lib')
const hpay = new Payment.HotPayPSC('HotPay secret', 'Notyfication password')

hpay.generatePayment(price, 'Product name', 'Redirect URL', 'paymentID').then((data)=>{
    console.log(JSON.parse(data).URL)
})
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
    var notyficationPassword = 'BxxlFfTiu59WMuA';
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
const cashbill = new Payment.CashBill('Secret key', 'ShopID', true/false);

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