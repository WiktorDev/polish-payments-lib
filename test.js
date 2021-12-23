const Payment = require('./index')
const hpay = new Payment.HotPayPSC('WWFvWHlFbVhyaTRURndTaWU1cjZVbUo4WURsZVEwdkVUcjlybWY4TXhlUT0,', 'CbCErX0xerR947A')

hpay.generatePayment("1", 'XXX', 'https://hotpay.pl', 'XXX').then((data)=>{
    console.log(JSON.parse(data).URL)
})