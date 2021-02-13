module.exports = function(params){
    return Object.keys(params).map((item, i) => `${encodeURIComponent(item)}=${encodeURIComponent(params[item])}`).join('&');
};