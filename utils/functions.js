const logger = require('./logger');

exports.inArray=(item, array)=>{
    var length = array.length;
    for(var i = 0; i < length; i++) {
        if(typeof array[i] == 'object') {
            if(arrayCompare(array[i], item)) return true;
        } else {
            if(array[i] == item) return true;
        }
    }
    return false;
}

exports.microsmsCheckPaymentStatus=(status)=>{
    if(status.includes('E,2')){
        logger.error('Partner or service not found.')
        return false
    }
    if(status.includes('E,3')){
        logger.error('Sms number is not valid.');
        return false
    }
    if(status.includes('1')){
        paid = true;
    }else{
        paid = false;
    }
    return paid
}