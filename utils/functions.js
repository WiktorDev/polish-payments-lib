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