exports.msmsValidateCode=(code)=>{
    var pattern = '^[A-Za-z0-9]{8}$'
    if(code.search(pattern) == 0){
        valid = true;
    }else{
        valid = false;
    }
    return valid;
}