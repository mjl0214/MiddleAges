var Utils = module.exports;
const Buffer = require('buffer').Buffer;
let md5 = require("md5");
//截取字符串，包括中文
//中文长度是两个字符
//hasDot：true 字符串后面加...
Utils.subStringCN = function(str, len, hasDot)
{
    if(str == null || str == ""){
        return "";
    }
    str = str.toString();
    var newLength = 0;
    var newStr = "";
    var chineseRegex = /[^\x00-\xff]/g;
    var singleChar = "";
    var strLength = str.replace(chineseRegex,"**").length;
    for(var i = 0;i < strLength;i++)
    {
        singleChar = str.charAt(i).toString();
        if(singleChar.match(chineseRegex) != null)
        {
            newLength += 2;
        }
        else
        {
            newLength++;
        }
        if(newLength > len)
        {
            break;
        }
        newStr += singleChar;
    }

    if(hasDot && strLength > len)
    {
        newStr += "...";
    }
    return newStr;
};
Utils.strLength = function(str) {
      var a = 0;
     for (var i = 0; i < str.length; i++) {
         if (str.charCodeAt(i) > 255)
              a += 2;//按照预期计数增加2
          else
              a++;
      }
      return a;
},

Utils.timeToString  = function(date,format) {
    var _date = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),
        "S+": date.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in _date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? _date[k] : ("00" + _date[k]).substr(("" + _date[k]).length));
        }
    }
    return format;
};

Utils.timestampToTime = function(timestamp){
    var date = new Date(timestamp * 1000);    // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
};

// 浮点数保留位数
// m 转换数字 n小数位数 isnit如果是整数则返回整数，不填则默认返回n位小数
Utils.floatToFixed = function(num,n,isint)
{
    if(num == null || isNaN(num)){
        num = 0;
    }
    // 整数就直接返回整数
    if(isint && Number.isInteger(num)){
        return num;
    }
    var _num = parseFloat(num);
    if(isNaN(_num))
    {
        _num = 0;
    }
    else
    {
        if(_num == 0){
            _num = 0;
        }else{
            _num = _num.toFixed(n);
        }
    }
    return _num;
};

Utils.floatRemoveTo2Str = function (a) {
    var _num = parseFloat(a);
    if(isNaN(_num)){
        return 0;
    }
    else{
        _num = Math.floor(_num * 100) / 100;
        _num = _num.toFixed(2);
        return String(_num);
    }
};

// 转为整数
Utils.parseInt = function(num){
    if(num == null || isNaN(num)){
        num = 0;
    }
    var _num = parseInt(num);
    if(isNaN(_num))
    {
        _num = 0;
    }
    return _num;
};


Utils.add_s = function (str) {
    var str = Utils.toBase64(str);
    var sStr = '';
    for (var i = 0; i < str.length; i++) {
        var Char = str.charAt(i);
        var a = str.charCodeAt(i);
        var xChar = String.fromCharCode(a + 1);
        sStr += xChar;
    };
    return sStr;
};

Utils.del_s = function (str) {
    var sStr = '';
    for (var i = 0; i < str.length; i++) {
        var Char = str.charAt(i);
        var a = str.charCodeAt(i);
        var xChar = String.fromCharCode(a - 1);
        sStr += xChar;
    };
    sStr = Utils.fromBase64(sStr);
    return sStr;
};

Utils.toBase64 = function(content){
	return new Buffer(content).toString('base64');
};

Utils.fromBase64 = function(content){
	return new Buffer(content, 'base64').toString();
};


// 列表中的项的某个属性与要查找的属性值相等，则返回该项所有数据
Utils.getInfoByProperty = function(list, property, value){
    var info = null;
    if(list == null || list.length <= 0){
        return null;
    }
    for(var i = 0; i < list.length; i++){
        var item = list[i];
        if(item[property] == value){
            info = item;
            break;
        }
    }
    return info;
};

// 根据某个属性分类
Utils.sortListByProperty = function(data, property){
    var sortDict = {};
    if(data){
        for(var i = 0; i < data.length; ++i){
            if(!sortDict[data[i][property]]){
                sortDict[data[i][property]] = [data[i]];
            }
            else{
                for(var key in sortDict){
                    if(key == data[i][property]){
                        sortDict[key].push(data[i]);
                        break;
                    }
                }
            }
        }
    }
    return sortDict;
};

// 在两个数之间随机一个整数
Utils.randomBetween2Number = function(min, max){
    return Math.round(Math.random() * (max - min) + min);
};

// 在两个整数之间随机一个整数
Utils.randomBetween2Integer = function(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
};

// 简化数字显示
Utils.getEasyNum = function(num){
    let str = "";
    if (num >= 100000000 ) {   // 亿
        str = Math.floor(num/100000000) + "亿";
    }
    else if (num >= 100000) {
        str = Math.floor(num/10000) + "万";
    }
    else {
        str = num;
    }

    return str;
};
Utils.getEasyNumHaveXiaoShu = function (num) {
    let str = "";
    if (num >= 100000000) {   // 亿
        str = (num / 100000000).toFixed(2) + "亿";
    }
    else if (num >= 10000) {
        str = (num / 10000).toFixed(2) + "万";
    }
    else {
        str = num;
    }

    return str;
};

Utils.getNumByComma = function (num) {
    var numStr = num+"";
    if (numStr.length <= 3) { return numStr; }
    var r = numStr.length % 3;
    return r > 0 ? numStr.slice(0, r) + "," + numStr.slice(r, numStr.length).match(/\d{3}/g).join(",") : numStr.slice(r, numStr.length).match(/\d{3}/g).join(",");  
};

Utils.paramsToMd5 = function (url, param,key) {
    var arr = url.split("/");
    var str = arr[arr.length - 1];
    str = str + JSON.stringify(param) + key;//"2B60T2z060dvRFjj";
    return md5.md5(str);
};

Utils.stringToMd5 = function (str) {
    return md5.md5(str);
};

//消息加密
Utils.reqMsgEncry = function (reqMsg) {
    let sign = md5.md5(JSON.stringify(reqMsg) + "f315e9bab02608309d0d2c55b7ba7a4d");
    reqMsg.Sign = sign;
    return reqMsg;
};

Utils.isEmojiCharacter = function(substring){
    if(substring){
        var reg = new RegExp("[~#^$@%&!?%*]", 'g');
        if (substring.match(reg)) {
            return true;
        }
        for ( var i = 0; i < substring.length; i++) {
            var hs = substring.charCodeAt(i);
            if (0xd800 <= hs && hs <= 0xdbff) {
                if (substring.length > 1) {
                    var ls = substring.charCodeAt(i + 1);
                    var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
                    if (0x1d000 <= uc && uc <= 0x1f77f) {
                        return true;
                    }
                }
            } else if (substring.length > 1) {
                var ls = substring.charCodeAt(i + 1);
                if (ls == 0x20e3) {
                    return true;
                }
            } else {
                if (0x2100 <= hs && hs <= 0x27ff) {
                    return true;
                } else if (0x2B05 <= hs && hs <= 0x2b07) {
                    return true;
                } else if (0x2934 <= hs && hs <= 0x2935) {
                    return true;
                } else if (0x3297 <= hs && hs <= 0x3299) {
                    return true;
                } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
                    || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
                    || hs == 0x2b50) {
                    return true;
                }
            }
        }
    }
};
//数组去重
Utils.unique = function (arr) {
    var hash = [];
    for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j]) {
                ++i;
            }
        }
        hash.push(arr[i]);
    }
    return hash;
};
    // 获取那年那月有多少天
Utils.getMonthsDay = function(year, month) {
    // var year = year;
    // var month = month;
    var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if ((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0)) {
        monthDays[1] = 29;
    }
    return monthDays[month-1];
};

// 获取这个月第一天星期几 
Utils.getMonthFirst = function(year, month) {
    var newDate = new Date(year, month-1, 1);
    return newDate.getDay();
};

// 克隆object
Utils.clone = function(obj) {
    var o;
    if (typeof obj == "object") {
        if (obj === null) {
            o = null;
        } else {
            if (obj instanceof Array) {
                o = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    o.push(Utils.clone(obj[i]));
                }
            } else {
                o = {};
                for (var j in obj) {
                    o[j] = Utils.clone(obj[j]);
                }
            }
        }
    } else {
        o = obj;
    }
    return o;
};
