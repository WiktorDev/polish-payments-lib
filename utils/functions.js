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

exports.implode=(glue, data)=>{
    let i = ''
    let retVal = ''
    let tGlue = ''
    if (arguments.length === 1) {
      data = glue
      glue = ''
    }
    if (typeof data === 'object') {
      if (Object.prototype.toString.call(data) === '[object Array]') {
        return data.join(glue)
      }
      for (i in data) {
        retVal += tGlue + data[i]
        tGlue = glue
      }
      return retVal
    }
    return data
}

exports.msmsValidateCode=(code)=>{
    var pattern = '^[A-Za-z0-9]{8}$'
    if(code.search(pattern) == 0){
        valid = true;
    }else{
        valid = false;
    }
    return valid;
}

exports.isNull=(data)=>{
    if(data == null){
        return true;
    }
    return false
}

exports.IsJsonString=(str)=>{
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}