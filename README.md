# polish-payments-lib
Polish Payments Providers nodejs library

### Supported payment methods:

* HotPay
* HotPay PSC

### Installation
```bash
npm install polish-payments-lib
```

#### HotPay

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
