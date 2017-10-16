//??????

$(function () {
//???string ??trim?????????????β???
    String.prototype.trim = function () {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    }
})


function mystopPropagation(e) {
    var ev = e || window.event;
    if (ev.stopPropagation) {
        ev.stopPropagation();
    } else {
        ev.cancelBubble = true;
    }
}


var Base64 = {
    // ????
    table: [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
        'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
        'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
        'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
        'w', 'x', 'y', 'z', '0', '1', '2', '3',
        '4', '5', '6', '7', '8', '9', '+', '/'
    ],
    UTF16ToUTF8: function (str) {
        var res = [], len = str.length;
        for (var i = 0; i < len; i++) {
            var code = str.charCodeAt(i);
            if (code > 0x0000 && code <= 0x007F) {
                // ????????????????0x0000?????????????
                // U+00000000 ?C U+0000007F  0xxxxxxx
                res.push(str.charAt(i));
            } else if (code >= 0x0080 && code <= 0x07FF) {
                // ????
                // U+00000080 ?C U+000007FF  110xxxxx 10xxxxxx
                // 110xxxxx
                var byte1 = 0xC0 | ((code >> 6) & 0x1F);
                // 10xxxxxx
                var byte2 = 0x80 | (code & 0x3F);
                res.push(
                    String.fromCharCode(byte1),
                    String.fromCharCode(byte2)
                );
            } else if (code >= 0x0800 && code <= 0xFFFF) {
                // ?????
                // U+00000800 ?C U+0000FFFF  1110xxxx 10xxxxxx 10xxxxxx
                // 1110xxxx
                var byte1 = 0xE0 | ((code >> 12) & 0x0F);
                // 10xxxxxx
                var byte2 = 0x80 | ((code >> 6) & 0x3F);
                // 10xxxxxx
                var byte3 = 0x80 | (code & 0x3F);
                res.push(
                    String.fromCharCode(byte1),
                    String.fromCharCode(byte2),
                    String.fromCharCode(byte3)
                );
            } else if (code >= 0x00010000 && code <= 0x001FFFFF) {
                // ?????
                // U+00010000 ?C U+001FFFFF  11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
            } else if (code >= 0x00200000 && code <= 0x03FFFFFF) {
                // ?????
                // U+00200000 ?C U+03FFFFFF  111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
            } else /** if (code >= 0x04000000 && code <= 0x7FFFFFFF)*/ {
                // ?????
                // U+04000000 ?C U+7FFFFFFF  1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
            }
        }

        return res.join('');
    },
    UTF8ToUTF16: function (str) {
        var res = [], len = str.length;
        var i = 0;
        for (var i = 0; i < len; i++) {
            var code = str.charCodeAt(i);
            // ?????????????ж?
            if (((code >> 7) & 0xFF) == 0x0) {
                // ?????
                // 0xxxxxxx
                res.push(str.charAt(i));
            } else if (((code >> 5) & 0xFF) == 0x6) {
                // ????
                // 110xxxxx 10xxxxxx
                var code2 = str.charCodeAt(++i);
                var byte1 = (code & 0x1F) << 6;
                var byte2 = code2 & 0x3F;
                var utf16 = byte1 | byte2;
                res.push(String.fromCharCode(utf16));
            } else if (((code >> 4) & 0xFF) == 0xE) {
                // ?????
                // 1110xxxx 10xxxxxx 10xxxxxx
                var code2 = str.charCodeAt(++i);
                var code3 = str.charCodeAt(++i);
                var byte1 = (code << 4) | ((code2 >> 2) & 0x0F);
                var byte2 = ((code2 & 0x03) << 6) | (code3 & 0x3F);
                utf16 = ((byte1 & 0x00FF) << 8) | byte2
                res.push(String.fromCharCode(utf16));
            } else if (((code >> 3) & 0xFF) == 0x1E) {
                // ?????
                // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
            } else if (((code >> 2) & 0xFF) == 0x3E) {
                // ?????
                // 111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
            } else /** if (((code >> 1) & 0xFF) == 0x7E)*/ {
                // ?????
                // 1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
            }
        }

        return res.join('');
    },
    encode: function (str) {
        if (!str) {
            return '';
        }
        var utf8 = this.UTF16ToUTF8(str); // ???UTF8
        var i = 0; // ????????
        var len = utf8.length;
        var res = [];
        while (i < len) {
            var c1 = utf8.charCodeAt(i++) & 0xFF;
            res.push(this.table[c1 >> 2]);
            // ?????2??=
            if (i == len) {
                res.push(this.table[(c1 & 0x3) << 4]);
                res.push('==');
                break;
            }
            var c2 = utf8.charCodeAt(i++);
            // ?????1??=
            if (i == len) {
                res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0F)]);
                res.push(this.table[(c2 & 0x0F) << 2]);
                res.push('=');
                break;
            }
            var c3 = utf8.charCodeAt(i++);
            res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0F)]);
            res.push(this.table[((c2 & 0x0F) << 2) | ((c3 & 0xC0) >> 6)]);
            res.push(this.table[c3 & 0x3F]);
        }

        return res.join('');
    },
    decode: function (str) {
        if (!str) {
            return '';
        }

        var len = str.length;
        var i = 0;
        var res = [];

        while (i < len) {
            code1 = this.table.indexOf(str.charAt(i++));
            code2 = this.table.indexOf(str.charAt(i++));
            code3 = this.table.indexOf(str.charAt(i++));
            code4 = this.table.indexOf(str.charAt(i++));

            c1 = (code1 << 2) | (code2 >> 4);
            c2 = ((code2 & 0xF) << 4) | (code3 >> 2);
            c3 = ((code3 & 0x3) << 6) | code4;

            res.push(String.fromCharCode(c1));

            if (code3 != 64) {
                res.push(String.fromCharCode(c2));
            }
            if (code4 != 64) {
                res.push(String.fromCharCode(c3));
            }

        }

        return this.UTF8ToUTF16(res.join(''));
    }
};
function FormatTime(datetime, sformate, option) {

    var res = null;
    var Time = new Date(datetime);
    var year = Time.getFullYear(); //??
    var month = Time.getMonth() + 1; //0----11 ????·?????
    var date = Time.getDate();//??
    var hour = Time.getHours();//?
    var minite = Time.getMinutes()//??;
    var sencond = Time.getSeconds();

    minite = minite >= 10 ? minite : '0' + minite;
    sencond = sencond > 10 ? sencond : '0' + sencond;

    sformate = sformate ? sformate : 'yyyy/mm/dd hh:mm';

    var nowDate = new Date();

    //yyyy/mm/dd hh:mm
    //mm-dd hh:mm

    if (sformate == 'mm-dd hh:mm') {
        if (option == 'yyyy') {
            if (year == nowDate.getFullYear()) {
                res = month + '-' + date + ' ' + hour + ':' + minite
            } else {
                res = year + '-' + month + '-' + date + ' ' + hour + ':' + minite
            }

        } else {
            res = month + '-' + date + ' ' + hour + ':' + minite
        }

    } else if (sformate == 'yyyy/mm/dd hh:mm') {
        res = year + "/" + month + "/" + date + " " + hour + ":" + minite;
    } else if (sformate == 'dd/mm') {
        res = date + '/' + month;
    } else if (sformate == 'yyyy-mm-dd hh:mm:ss') {
        res = res = year + "-" + month + "-" + date + " " + hour + ":" + minite + ':' + sencond;
    } else if (sformate == 'yyyy-mm-dd hh:mm') {
        res = res = year + "-" + month + "-" + date + " " + hour + ":" + minite;
    } else if (sformate == 'yyyy年mm月dd日') {
        res = year + '年' + month + '月' + date + '日'
    }

    return res

};
function getUrl(str_url) {

    //var strRegex=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
    //var strRegex=/((http|ftp|https):\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/g
//var strRegex='(((ht|f)tp(s?))\://)?(www.|[a-zA-Z].)[a-zA-Z0-9\-\.]+\.(com|edu|gov|mil|net|org|biz|info|name|museum|us|ca|uk)(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\;\?\'\\\+&%\$#\=~_\-]+))*'
//    var strRegex=/((http|ftp|https):\/\/)|(www\.)[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/g
    var strRegex = /(((http|ftp|https):\/\/)|(www\.))[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/g

    if (strRegex.test(str_url)) {
        var re = new RegExp(strRegex, 'g');
        return str_url.match(re)
    } else {
        return [];
    }

};
//tittle ??? ??? ??? ??С ???
function TitleTools() {
    $('.tool li').on('click', function () {
        mystopPropagation();
        //???
        if ($(this).hasClass('Winclose')) {
            try {
                stopVoice();
                window.lxpc.closewnd();
            }
            catch (e) {
                console.log(e.message)
            }


        } else if ($(this).hasClass('Winmax')) {  //???

            $(this).removeClass('Winmax').addClass('Winreback');
            try {

                window.lxpc.maxwnd();
            }
            catch (e) {
                console.log(e.message)
            }


        } else if ($(this).hasClass('Winmin')) {//??С

            try {

                window.lxpc.minwnd();
            }
            catch (e) {
                console.log(e.message)
            }


        } else if ($(this).hasClass('Winreback')) {//???

            $(this).removeClass('Winreback').addClass('Winmax');

            try {

                window.lxpc.restorewnd();
            }
            catch (e) {

            }
        } else {
            try {

                window.lxpc.closewnd();
            }
            catch (e) {
                console.log(e.message)
            }
        }

    });
};

//?????λ?????????????????С
function RsetFileSize(size) {
    //size = parseFloat(size)

    var result
    if (size < 1024) {
        result = size + ' B'
    } else if (size < 1024 * 1024) {
        result = Math.ceil(size / 1024) + ' KB'
    } else if (size < 1024 * 1024 * 1024) {
        result = Math.ceil(size / 1024 / 1024) + ' MB'

    } else {
        result = Math.ceil(size / 1024 / 1024 / 1024) + ' G'
    }

    return result;

};
function createGuid() {
    function GUID() {
        this.date = new Date();

        /* ?ж????????????????????????????????????????????У????????????? */
        if (typeof this.newGUID != 'function') {

            /* ????GUID?? */
            GUID.prototype.newGUID = function () {
                this.date = new Date();
                var guidStr = '';
                sexadecimalDate = this.hexadecimal(this.getGUIDDate(), 16);
                sexadecimalTime = this.hexadecimal(this.getGUIDTime(), 16);
                for (var i = 0; i < 9; i++) {
                    guidStr += Math.floor(Math.random() * 16).toString(16);
                }
                guidStr += sexadecimalDate;
                guidStr += sexadecimalTime;
                while (guidStr.length < 32) {
                    guidStr += Math.floor(Math.random() * 16).toString(16);
                }
                return this.formatGUID(guidStr);
            }

            /*
             * ????????????????GUID???????8λ?????????19700101
             * ???????????GUID??????????????
             */
            GUID.prototype.getGUIDDate = function () {
                return this.date.getFullYear() + this.addZero(this.date.getMonth() + 1) + this.addZero(this.date.getDay());
            }

            /*
             * ???????????????GUID???????8λ????????????????????2λ????12300933
             * ???????????GUID??????????????
             */
            GUID.prototype.getGUIDTime = function () {
                return this.addZero(this.date.getHours()) + this.addZero(this.date.getMinutes()) + this.addZero(this.date.getSeconds()) + this.addZero(parseInt(this.date.getMilliseconds() / 10));
            }

            /*
             * ????: ??λ????????????????0??????????????NaN??????????????????
             * ????: ??????????????????0?????????????????????????
             * ?????: ????????????????????0?????????????????????????????
             */
            GUID.prototype.addZero = function (num) {
                if (Number(num).toString() != 'NaN' && num >= 0 && num < 10) {
                    return '0' + Math.floor(num);
                } else {
                    return num.toString();
                }
            }

            /*
             * ???????y??????????????x????????
             * ????????1???????????????????????2??????????????????????3???????????????????????????粻д???10
             * ??????????????????????
             */
            GUID.prototype.hexadecimal = function (num, x, y) {
                if (y != undefined) {
                    return parseInt(num.toString(), y).toString(x);
                } else {
                    return parseInt(num.toString()).toString(x);
                }
            }

            /*
             * ??????????32λ????????GUID?????????
             * ????????1?????????32λ???????
             * ??????????GUID??????????
             */
            GUID.prototype.formatGUID = function (guidStr) {
                var str1 = guidStr.slice(0, 8) + '-',
                    str2 = guidStr.slice(8, 12) + '-',
                    str3 = guidStr.slice(12, 16) + '-',
                    str4 = guidStr.slice(16, 20) + '-',
                    str5 = guidStr.slice(20);
                return str1 + str2 + str3 + str4 + str5;
            }
        }
    }

    var guid = new GUID();

    return guid.newGUID();
};

//????????Unicode

function Unicode(str) {
    function unicode(str) {
        var value = '';
        for (var i = 0; i < str.length; i++) {
            value += '\\u' + left_zero_4(parseInt(str.charCodeAt(i)).toString(16));
        }
        return value;
    }

    function left_zero_4(str) {
        if (str != null && str != '' && str != 'undefined') {
            if (str.length == 2) {
                return '00' + str;
            }
        }
        return str;
    };
    return unicode(str);
}

//function tohanzi(data)
//{
//    if(data == '') return '';
//    data = data.split("\u");
//    var str ='';
//    for(var i=0;i<data.length;i++)
//    {
//        str+=String.fromCharCode(parseInt(data[i],16).toString(10));
//    }
//    return str;
//}
function reconvert(str) {
    str = str.replace(/(\\u)(\w{1,4})/gi, function ($0) {
        return (String.fromCharCode(parseInt((escape($0).replace(/(%5Cu)(\w{1,4})/g, "$2")), 16)));
    });
    str = str.replace(/(&#x)(\w{1,4});/gi, function ($0) {
        return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{1,4})(%3B)/g, "$2"), 16));
    });
    str = str.replace(/(&#)(\d{1,6});/gi, function ($0) {
        return String.fromCharCode(parseInt(escape($0).replace(/(%26%23)(\d{1,6})(%3B)/g, "$2")));
    });

    return str;
};

function EncodeUtf8(str) {
    //???????UTF-8????

    function EncodeUtf8(s1) {
        var s = escape(s1);
        var sa = s.split("%");
        var retV = "";
        if (sa[0] != "") {
            retV = sa[0];
        }
        for (var i = 1; i < sa.length; i++) {
            if (sa[i].substring(0, 1) == "u") {
                retV += Hex2Utf8(Str2Hex(sa[i].substring(1, 5)));

            }
            else retV += "%" + sa[i];
        }

        return retV;
    }

    function Str2Hex(s) {
        var c = "";
        var n;
        var ss = "0123456789ABCDEF";
        var digS = "";
        for (var i = 0; i < s.length; i++) {
            c = s.charAt(i);
            n = ss.indexOf(c);
            digS += Dec2Dig(eval(n));

        }
        //return value;
        return digS;
    }

    function Dec2Dig(n1) {
        var s = "";
        var n2 = 0;
        for (var i = 0; i < 4; i++) {
            n2 = Math.pow(2, 3 - i);
            if (n1 >= n2) {
                s += '1';
                n1 = n1 - n2;
            }
            else
                s += '0';

        }
        return s;

    }

    function Dig2Dec(s) {
        var retV = 0;
        if (s.length == 4) {
            for (var i = 0; i < 4; i++) {
                retV += eval(s.charAt(i)) * Math.pow(2, 3 - i);
            }
            return retV;
        }
        return -1;
    }

    function Hex2Utf8(s) {
        var retS = "";
        var tempS = "";
        var ss = "";
        if (s.length == 16) {
            tempS = "1110" + s.substring(0, 4);
            tempS += "10" + s.substring(4, 10);
            tempS += "10" + s.substring(10, 16);
            var sss = "0123456789ABCDEF";
            for (var i = 0; i < 3; i++) {
                retS += "%";
                ss = tempS.substring(i * 8, (eval(i) + 1) * 8);


                retS += sss.charAt(Dig2Dec(ss.substring(0, 4)));
                retS += sss.charAt(Dig2Dec(ss.substring(4, 8)));
            }
            return retS;
        }
        return "";
    }

    return EncodeUtf8(str);

};
function init_File(parm, targ, $down, $saveAs, cb) {
    console.log(JSON.stringify(parm))
    if (!parm.fileResId) {
        return;
    }

    try {
        window.lxpc.exebusinessaction('ChatRecord', 'CheckResource', '0', JSON.stringify(parm), targ, function (status, result, targ) {
            if (status == 0) {

                var data = JSON.parse(result);

                if (data.filePath) {

                    $down.html(settrans('打开'));
                    $saveAs.html(settrans('打开文件夹'));
                    $down.data('path', data.filePath);
                    $saveAs.data('path', data.filePath);
                    $down.addClass('openfile');
                    $saveAs.addClass('openfileDir');

                    if (Object.prototype.toString.call(cb) == "[object Function]") {
                        cb(data.filePath)
                    }

                }


            } else {
                console.log(status)
            }


        })

    } catch (e) {
        console.log(e.message)
    }
}
function bindfiledown($down, $saveAs, filename, resId, $filebox) {

    if ($down.hasClass('openfile')) {//下载完成之后打开文件

        var parm = {filePath: $down.data('path')};

        try {
            window.lxpc.exebusinessaction('ChatRecord', 'OpenFile', '0', JSON.stringify(parm), 0, function (status, result, targ) {

                if (status == 0) {
                    //成功
                } else {
                    //失败重新下载
                    $down.html(settrans('下载'));
                    $saveAs.html(settrans('另存为'))
                    $down.removeClass('openfile');
                    $saveAs.removeClass('openfileDir');
                }

            })

        } catch (e) {
            console.log(e.message)
        }


    } else {//下载文件

        var str = '<img src="images/ajax-loader_smail.gif" style="" alt="" class="mlr_Downfile">';

        $filebox.append(str);

        var parm = {resourceList: [{resourceType: 'res_file', fileName: filename, photoResId: resId}]}

        try {
            window.lxpc.exebusinessaction('DownloadResource', 'Noticefile', '0', JSON.stringify(parm), 0, function (status, result, targ) {

                if (status == 0) {

                    if (result.indexOf('\\') > -1 || result.indexOf('/') > -1) {

                        $filebox.find('.mlr_Downfile').remove();
                        showtips('文件下载成功')
                        $down.html(settrans('打开'));
                        $saveAs.html(settrans('打开文件夹'))
                        $down.addClass('openfile');
                        $saveAs.addClass('openfileDir');
                        $down.data('path', result);
                        $saveAs.data('path', result);
                    }


                } else {
                    console.log(status)
                }

            })


        } catch (e) {
            console.log(e.message)
        }

    }
};
function bindfilesaveAS($down, $saveAs, filename, resId, $filebox) {


    if ($saveAs.hasClass('openfileDir')) {//另存为后打开文件

        var parm = {filePath: $saveAs.data('path')}

        try {
            window.lxpc.exebusinessaction('ChatRecord', 'OpenFileDir', '0', JSON.stringify(parm), 0, function (status, result, targ) {

                if (status == 0) {

                } else {
                    $down.html(settrans('下载'));
                    $saveAs.html(settrans('另存为'))
                    $saveAs.removeClass('openfileDir');
                    $down.removeClass('openfile');
                }


            })

        } catch (e) {
            console.log(e.message)
        }


    } else {//另存为

        var parm = {fileName: filename}


        try {
            window.lxpc.exebusinessaction('ChatRecord', 'OpenSaveAsWnd', '0', JSON.stringify(parm), 0, function (status, result, targ) {

                if (status == 0) {


                    var data = JSON.parse(result),
                        filePath = data.filePath;

                    var index = filePath.lastIndexOf('\\');
                    index = index > -1 ? index : filePath.lastIndexOf('/')
                    var path = filePath.substring(0, index);

                    var parm = {
                        resourceList: [{
                            resourceType: 'res_file',
                            fileName: filename,
                            photoResId: resId,
                            filePath: path
                        }]
                    }

                    var str = '<img src="images/ajax-loader_smail.gif" style="" alt="" class="mlr_Downfile">';

                    $filebox.append(str);


                    try {
                        window.lxpc.exebusinessaction('DownloadResource', 'Noticefile', '0', JSON.stringify(parm), 0, function (status, result, targ) {

                            if (status == 0) {

                                if (result.indexOf('\\') || result.indexOf('/') > -1) {
                                    showtips('另存为成功')
                                    $filebox.find('.mlr_Downfile').remove();
                                    $down.html(settrans('打开'));
                                    $saveAs.html(settrans('打开文件夹'))
                                    $saveAs.addClass('openfileDir');
                                    $down.addClass('openfile');
                                    $down.data('path', result);
                                    $saveAs.data('path', result);
                                }


                            } else {
                                console.log(status)
                            }

                        })


                    } catch (e) {
                        console.log(e.message)
                    }


                } else {
                    console.log(status)
                }

            })


        } catch (e) {
            console.log(e.message)
        }

    }
};
//支持鼠标上下键
//支持上下键
function keyDown($box, hightclass, scroll) {

    var children = $box.children(),
        total = children.length;

    document.onkeydown = function (event) {

        var keyIndex = $box.find('.' + hightclass).index();
        var curIndex = $box.find('.' + hightclass).index();

        if (total == 0 || total == 1) {
            return;
        }
        if (event.keyCode == 38)//上
        {

            if (keyIndex == 0) {
                curIndex = total - 1;
            } else {
                curIndex = keyIndex - 1;
            }
            clickTr(curIndex)
        }
        if (event.keyCode == 40)//下
        {

            if (keyIndex == total - 1) {
                curIndex = 0;
            } else {
                curIndex = keyIndex + 1;
            }
            clickTr(curIndex)
        }

        function clickTr(currTrIndex) {
            if (currTrIndex > -1) {

                var $item = children.eq(currTrIndex).addClass(hightclass);

                //scroll.scrollToElement($item[0],200)
            }
            children.eq(keyIndex).removeClass(hightclass);
            keyIndex = currTrIndex;
        }
    }
}

/*********************补全两位数***********************************/
function ToDou(n) {
    n > 0 && n < 10 ? "0" + n : n;
    return n;
}

function resetTime(time, format) {
    var NowDate = new Date(),
        comparedDate = new Date(time);
    //查询当天的结果
    if (NowDate.getFullYear() == comparedDate.getFullYear() && NowDate.getMonth() == comparedDate.getMonth() && NowDate.getDate() == comparedDate.getDate()) {

        var nowTime = NowDate.getTime(),
            temTime = comparedDate.getTime();

        var spantime = nowTime - temTime;

        var s = Math.floor(spantime / 1000);

        var day = Math.floor(s / (3600 * 24));
        s %= (3600 * 24);
        var hour = Math.floor(s / 3600);
        s %= 3600;
        var minute = Math.floor(s / 60);
        var second = s % 60;

        if (hour < 1) {
            if (minute < 1) {
                return '刚刚'
            } else {
                return ToDou(minute) + '分钟前'
            }

        } else {
            return hour + '小时前'
        }


    } else {
        format = format || 'mm-dd hh:mm';

        if (format == 'mm-dd hh:mm') {
            return ToDou(comparedDate.getMonth() + 1) + '-' + ToDou(comparedDate.getDate()) + ' ' + ToDou(comparedDate.getHours()) + ':' + ToDou(comparedDate.getMinutes())

        } else if (format == 'yyyy/mm/dd') {
            return comparedDate.getFullYear() + '/' + ToDou(comparedDate.getMonth() + 1) + '/' + ToDou(comparedDate.getDate())
        }
    }
}
//文件大小
function FormatSize(size) {
    size = parseFloat(size)
    var result
    if (size < 1024) {
        result = size + ' B'
    } else if (size < 1024 * 1024) {
        result = Math.ceil(size / 1024) + ' KB'
    } else if (size < 1024 * 1024 * 1024) {
        result = Math.ceil(size / 1024 / 1024) + ' MB'
    } else {
        result = Math.ceil(size / 1024 / 1024 / 1024) + ' G'
    }
    return result;

}
//文件转换成字节
function DeFormatSize(size) {

    var reSize = size.toUpperCase();

    size = parseFloat(size)
    var result
    if (reSize.indexOf('G') > -1) {
        result = size * 1024 * 1024 * 1024
    } else if (reSize.indexOf('M') > -1) {
        result = size * 1024 * 1024
    } else if (reSize.indexOf('K') > -1) {
        result = size * 1024
    } else if (reSize.indexOf('B') > -1) {
        result = size
    }

    return result;

}

//时间大小
function ReSizeforTime(size) {
    size = parseFloat(size)
    //2:30'50''
    var result,
        min,
        h,
        s;

    size = Math.ceil(size / 1000);
    if (size < 60) {//秒
        result = size + '"'
    } else if (size < (60 * 60)) {//分
        min = Math.floor(size / (60))
        result = min + "'" + Math.ceil((size - min * 60)) + '"'
    } else {

        h = Math.floor(size / (60 * 60));
        min = Math.floor((size - h * 60 * 60) / 60);
        s = Math.ceil(size - h * 60 * 60) % 60
        result = h + ':' + min + "'" + s + '"'
    }
    return result;

}
//下载资源
function downresource(parm, targ, callback) {

    try {

        window.lxpc.exebusinessaction('DownloadResource', 'HeaderImage', '0', JSON.stringify(parm), targ, function (status, result, targ) {

            if (status == 0) {

                if (Object.prototype.toString.call(callback) == '[object Function]') {

                    callback(result, targ);
                }


            } else {

                //my_layer({message: '调用接口出错，错误码' + status}, 'error')
                callback(result, targ);
                console.log(status)
            }


        })
    }
    catch (e) {
        my_layer({message: '调用接口出错，错误码' + e.message}, 'error')
        console.log(e.message)
    }


};
//打开图片预览
function ViewSrcPicture($ele, parm) {

    //var parm = {picturePath: result};

    try {
        window.lxpc.exebusinessaction('notice', 'ViewSrcPicture', '0', JSON.stringify(parm), 0, null)
    }
    catch (e) {

        console.log(e.message);
    }
    mystopPropagation(event);
}
function scrollSetings() {
    return {

        probeType: 2,
        scrollbars: "custom",
        mouseWheel: true,
        bounce: false,
        interactiveScrollbars: true,
        shrinkScrollbars: 'scale',
        preventDefault: false,
        momentum: false,
        disableMouse: true,
        disablePointer: true


    }
}

//筛选出map地址
function mapAddress(str) {

    //var reg=/\{\S+\|\d+(\.\d+),\d+(\.\d+)\}/g;
    var reg = /\{([^}|]*)\|(\d{1,3}\.\d+,\d{1,3}\.\d+)\}/g;
    return reg.test(str)
}
//打开地图
function openMap(parm, code) {

    try {
        if (code == '' || code == null || typeof(code) == 'undefined') {
            code = 'notice'
        }
        window.lxpc.exebusinessaction(code, 'OpenUrl', '0', JSON.stringify(parm), 0, null)
    }
    catch (e) {

        console.log(e.message);
    }


}
//获取语音时长
function getVoiceLength(parm, cb, targ) {

    var id = targ ? targ : 0

    try {

        window.lxpc.exebusinessaction('DownloadResource', 'voice', '0', JSON.stringify(parm), id, function (status, result, targ) {

            if (status == 0) {

                var voice_parm = {filePath: result};

                try {
                    window.lxpc.exebusinessaction('Notice', 'GetVoiceLength', '0', JSON.stringify(voice_parm), targ, function (status, result, targ) {

                        if (status == 0) {
                            var data = JSON.parse(result)

                            if (Object.prototype.toString.call(cb) == '[object Function]') {

                                cb({filePath: data.filePath, size: data.voiceLength}, targ)
                            }

                        } else {
                            my_layer({message: '读取数据出错，状态码' + status}, 'error')
                        }

                    })
                }
                catch (e) {

                    my_layer({message: '调取接口出错：错误码' + e.message}, 'error');
                }


            } else {
                console.log('下载失败')
            }


        })
    }
    catch (e) {

        console.log(e.message)

    }


}
//播放音频
function playVoice(parm, cb) {

    //var parm={filePath:filePath}

    try {
        window.lxpc.exebusinessaction('Notice', 'PlayVoice', '0', JSON.stringify(parm), 0, function (status, result, targ) {
            if (status == 0) {

                if (Object.prototype.toString.call(cb) == '[object Function]') {
                    cb()
                }
            } else {
                my_layer({message: '读取数据出错，状态码' + status}, 'error')
            }

        })
    } catch (e) {
        my_layer({message: '调取接口出错：错误码' + e.message}, 'error');
    }
}

//播放音频
function stopVoice() {

    //var parm={filePath:filePath}

    try {
        window.lxpc.exebusinessaction('Notice', 'StopPlayVoice', '0', '', 0, function (status, result, targ) {
            if (status == 0) {


            } else {
                my_layer({message: '读取数据出错，状态码' + status}, 'error')
            }

        })
    } catch (e) {
        my_layer({message: '调取接口出错：错误码' + e.message}, 'error');
    }
}


var utils = (function () {

    function prependChild(o, s) {
        if (s.hasChildNodes()) {
            s.insertBefore(o, s.firstChild);
        } else {
            s.appendChild(o);
        }
    }

    function insertAfert(o, s) {
        if (s.nextSibling != null) {
            s.parentNode.insertBefore(o, s.nextSibling);
        } else {
            s.parentNode.appendChild(o);
        }
    }

    return {
        prependChild: prependChild,
        insertAfert: insertAfert
    }
})()

//toast提示
function showtips(tipContent, request) {
    var otip = document.createElement('div');
    otip.className = 'tips';

    otip.innerHTML = ' <div class="tips_b"></div><div class="tips_c">' + settrans(tipContent) + '</div>';
    var oitem = document.body.appendChild(otip)

    if (request && request.prototype.toString.call(request)) {

        new Promise(function (resolve, reject) {

            request(resolve)

        }).then(function (content) {
                var otitle = oitem.querySelector('.tips_c');

                otitle.innerHTML = content
                setTimeout(function () {
                    $(oitem).animate({opacity: 0}, 1500, function () {
                        $(this).remove();

                    })
                }, 1500)


            }
        )

    } else {

        setTimeout(function () {
            $(oitem).animate({opacity: 0}, 1500, function () {
                $(this).remove();

            })
        }, 1500)
    }


}


//提示插件
$(function () {
    $.fn.extend({
        showTitle: function () {

            //var  d=$('<div id="tipBox"></div>').appendTo('body');
            var d = document.querySelector('#tipBox');

            this.bind({
                mouseenter: function (event) {

                    if (!d) {
                        d = $('<div id="tipBox"></div>').appendTo('body');
                    } else {
                        d = $(d);
                    }
                    var title = $(this).attr("title");
//定义位置
                    var t = $('#tipBox').outerHeight();
                    var b = t + 6;	//设置提示框相对于偏移位置，防止遮挡鼠标


                    d.css({top: event.pageY - b + "px", left: event.pageX + "px"}).text($(this).attr("title"));
//显示
                    d.show();

                    event.stopPropagation()
                },
                mouseleave: function (event) {
//鼠标一走隐藏

                    d.hide();
                    event.stopPropagation()
                }
            });
            $(window).on('click', function () {

                if (d) {
                    $(d).hide();
                }
            })
        }
    });
})


;

////html 转移成字符串
//function XssToString(content){
//    var options = {
//        whiteList: {
//            a: ['href', 'title', 'target', 'src','border','width','height','bgcolor','list-style','text-align','iframe','http','appendChild','onerror',"'",'createElement']
//        },
//
//        allowCommentTag:true
//    };
//
//
//    return filterXSS(content,options)
//}
//html 转移成字符串
function XssToString(content) {
    if (content == '' || !content) {
        return content
    }
    if (Object.prototype.toString.call(content) != '[object String]') {
        return content;
    }

    content = content.replace(/"/g, "&quot;");
    content = content.replace(/'/g, "&#39;");

    var options = {
        whiteList: {
            a: ['href', 'title', 'target', 'src', 'border', 'width', 'height', 'bgcolor', 'list-style', 'text-align', 'iframe', 'http', 'appendChild', 'onerror', "'", 'createElement']
        },

        allowCommentTag: true
    };


    return filterXSS(content, options)
}
//根据文件的类型设置不同的背景图片
function getFileIcon(strType) {
    if (!strType) {
        return;
    }
    if (strType.indexOf('/') > -1) {
        strType = strType.split('/')[1]
    } else {
        var arry = strType.split('.')
        if (arry) {
            if (arry.length == 2) {
                strType = arry[1]
            }
        } else {
            strType = ''
        }

    }

    var path = ''
    switch (strType) {
        case 'pptx':
        case 'ppt':
        case 'pps':
        case 'pot':
        case 'vnd.ms-powerpoint':
            path = './images/ppt.png'
            break;
        case 'audio':
        case 'mpeg':
            path = './images/audio.png'
            break;
        case 'doc':
        case 'docx':
        case 'dot':
        case 'msword':
            path = './images/doc.png'
            break;
        case 'pdf':
            path = './images/ml_file_pdf.png'
            break;
        case 'html':
        case 'htm':
            path = './images/html.png'
            break;
        case 'zip':
            path = './images/zip.png'
            break;
        case 'js':
            path = './images/js.png'
            break;
        case 'mov':
        case 'mp4':
            path = './images/mov.png'
            break;
        case 'xls':
        case 'xlsx':
        case 'vnd.ms-excel':
            path = './images/xls.png'
            break;
        case 'png':
        case 'jpg':
        case 'tiff':
        case 'jpeg':
        case 'image':
        case 'gif':
        case 'bmp':


            path = './images/ic_file_jpg@1x.png'
            break;
        default:
            path = './images/ml_file_default.png';
            break;

    }
    return path
}
$(function () {
    function charPYStr() {
        return '啊阿埃挨哎唉哀皑癌蔼矮艾碍爱隘鞍氨安俺按暗岸胺案肮昂盎凹敖熬翱袄傲奥懊澳芭捌扒叭吧笆八疤巴拔跋靶把耙坝霸罢爸白柏百摆佰败拜稗斑班搬扳般颁板版扮拌伴瓣半办绊邦帮梆榜膀绑棒磅蚌镑傍谤苞胞包褒剥薄雹保堡饱宝抱报暴豹鲍爆杯碑悲卑北辈背贝钡倍狈备惫焙被奔苯本笨崩绷甭泵蹦迸逼鼻比鄙笔彼碧蓖蔽毕毙毖币庇痹闭敝弊必辟壁臂避陛鞭边编贬扁便变卞辨辩辫遍标彪膘表鳖憋别瘪彬斌濒滨宾摈兵冰柄丙秉饼炳病并玻菠播拨钵波博勃搏铂箔伯帛舶脖膊渤泊驳捕卜哺补埠不布步簿部怖擦猜裁材才财睬踩采彩菜蔡餐参蚕残惭惨灿苍舱仓沧藏操糙槽曹草厕策侧册测层蹭插叉茬茶查碴搽察岔差诧拆柴豺搀掺蝉馋谗缠铲产阐颤昌猖场尝常长偿肠厂敞畅唱倡超抄钞朝嘲潮巢吵炒车扯撤掣彻澈郴臣辰尘晨忱沉陈趁衬撑称城橙成呈乘程惩澄诚承逞骋秤吃痴持匙池迟弛驰耻齿侈尺赤翅斥炽充冲冲虫崇宠抽酬畴踌稠愁筹仇绸瞅丑臭初出橱厨躇锄雏滁除楚础储矗搐触处揣川穿椽传船喘串疮窗幢床闯创吹炊捶锤垂春椿醇唇淳纯蠢戳绰疵茨磁雌辞慈瓷词此刺赐次聪葱囱匆从丛凑粗醋簇促蹿篡窜摧崔催脆瘁粹淬翠村存寸磋撮搓措挫错搭达答瘩打大呆歹傣戴带殆代贷袋待逮怠耽担丹单郸掸胆旦氮但惮淡诞弹蛋当挡党荡档刀捣蹈倒岛祷导到稻悼道盗德得的蹬灯登等瞪凳邓堤低滴迪敌笛狄涤翟嫡抵底地蒂第帝弟递缔颠掂滇碘点典靛垫电佃甸店惦奠淀殿碉叼雕凋刁掉吊钓调跌爹碟蝶迭谍叠丁盯叮钉顶鼎锭定订丢东冬董懂动栋侗恫冻洞兜抖斗陡豆逗痘都督毒犊独读堵睹赌杜镀肚度渡妒端短锻段断缎堆兑队对墩吨蹲敦顿囤钝盾遁掇哆多夺垛躲朵跺舵剁惰堕蛾峨鹅俄额讹娥恶厄扼遏鄂饿恩而儿耳尔饵洱二贰发罚筏伐乏阀法珐藩帆番翻樊矾钒繁凡烦反返范贩犯饭泛坊芳方肪房防妨仿访纺放菲非啡飞肥匪诽吠肺废沸费芬酚吩氛分纷坟焚汾粉奋份忿愤粪丰封枫蜂峰锋风疯烽逢冯缝讽奉凤佛否夫敷肤孵扶拂辐幅氟符伏俘服浮涪福袱弗甫抚辅俯釜斧脯腑府腐赴副覆赋复傅付阜父腹负富讣附妇缚咐噶嘎该改概钙盖溉干甘杆柑竿肝赶感秆敢赣冈刚钢缸肛纲岗港杠篙皋高膏羔糕搞镐稿告哥歌搁戈鸽胳疙割革葛格蛤阁隔铬个各给根跟耕更庚羹埂耿梗工攻功恭龚供躬公宫弓巩汞拱贡共钩勾沟苟狗垢构购够辜菇咕箍估沽孤姑鼓古蛊骨谷股故顾固雇刮瓜剐寡挂褂乖拐怪棺关官冠观管馆罐惯灌贯光广逛瑰规圭硅归龟闺轨鬼诡癸桂柜跪贵刽辊滚棍锅郭国果裹过哈骸孩海氦亥害骇酣憨邯韩含涵寒函喊罕翰撼捍旱憾悍焊汗汉夯杭航壕嚎豪毫郝好耗号浩呵喝荷菏核禾和何合盒貉阂河涸赫褐鹤贺嘿黑痕很狠恨哼亨横衡恒轰哄烘虹鸿洪宏弘红喉侯猴吼厚候后呼乎忽瑚壶葫胡蝴狐糊湖弧虎唬护互沪户花哗华猾滑画划化话槐徊怀淮坏欢环桓还缓换患唤痪豢焕涣宦幻荒慌黄磺蝗簧皇凰惶煌晃幌恍谎灰挥辉徽恢蛔回毁悔慧卉惠晦贿秽会烩汇讳诲绘荤昏婚魂浑混豁活伙火获或惑霍货祸击圾基机畸稽积箕肌饥迹激讥鸡姬绩缉吉极棘辑籍集及急疾汲即嫉级挤几脊己蓟技冀季伎祭剂悸济寄寂计记既忌际妓继纪嘉枷夹佳家加荚颊贾甲钾假稼价架驾嫁歼监坚尖笺间煎兼肩艰奸缄茧检柬碱硷拣捡简俭剪减荐槛鉴践贱见键箭件健舰剑饯渐溅涧建僵姜将浆江疆蒋桨奖讲匠酱降蕉椒礁焦胶交郊浇骄娇嚼搅铰矫侥脚狡角饺缴绞剿教酵轿较叫窖揭接皆秸街阶截劫节茎睛晶鲸京惊精粳经井警景颈静境敬镜径痉靖竟竞净炯窘揪究纠玖韭久灸九酒厩救旧臼舅咎就疚鞠拘狙疽居驹菊局咀矩举沮聚拒据巨具距踞锯俱句惧炬剧捐鹃娟倦眷卷绢撅攫抉掘倔爵桔杰捷睫竭洁结解姐戒藉芥界借介疥诫届巾筋斤金今津襟紧锦仅谨进靳晋禁近烬浸尽劲荆兢觉决诀绝均菌钧军君峻俊竣浚郡骏喀咖卡咯开揩楷凯慨刊堪勘坎砍看康慷糠扛抗亢炕考拷烤靠坷苛柯棵磕颗科壳咳可渴克刻客课肯啃垦恳坑吭空恐孔控抠口扣寇枯哭窟苦酷库裤夸垮挎跨胯块筷侩快宽款匡筐狂框矿眶旷况亏盔岿窥葵奎魁傀馈愧溃坤昆捆困括扩廓阔垃拉喇蜡腊辣啦莱来赖蓝婪栏拦篮阑兰澜谰揽览懒缆烂滥琅榔狼廊郎朗浪捞劳牢老佬姥酪烙涝勒乐雷镭蕾磊累儡垒擂肋类泪棱楞冷厘梨犁黎篱狸离漓理李里鲤礼莉荔吏栗丽厉励砾历利傈例俐痢立粒沥隶力璃哩俩联莲连镰廉怜涟帘敛脸链恋炼练粮凉梁粱良两辆量晾亮谅撩聊僚疗燎寥辽潦了撂镣廖料列裂烈劣猎琳林磷霖临邻鳞淋凛赁吝拎玲菱零龄铃伶羚凌灵陵岭领另令溜琉榴硫馏留刘瘤流柳六龙聋咙笼窿隆垄拢陇楼娄搂篓漏陋芦卢颅庐炉掳卤虏鲁麓碌露路赂鹿潞禄录陆戮驴吕铝侣旅履屡缕虑氯律率滤绿峦挛孪滦卵乱掠略抡轮伦仑沦纶论萝螺罗逻锣箩骡裸落洛骆络妈麻玛码蚂马骂嘛吗埋买麦卖迈脉瞒馒蛮满蔓曼慢漫谩芒茫盲氓忙莽猫茅锚毛矛铆卯茂冒帽貌贸么玫枚梅酶霉煤没眉媒镁每美昧寐妹媚门闷们萌蒙檬盟锰猛梦孟眯醚靡糜迷谜弥米秘觅泌蜜密幂棉眠绵冕免勉娩缅面苗描瞄藐秒渺庙妙蔑灭民抿皿敏悯闽明螟鸣铭名命谬摸摹蘑模膜磨摩魔抹末莫墨默沫漠寞陌谋牟某拇牡亩姆母墓暮幕募慕木目睦牧穆拿哪呐钠那娜纳氖乃奶耐奈南男难囊挠脑恼闹淖呢馁内嫩能妮霓倪泥尼拟你匿腻逆溺蔫拈年碾撵捻念娘酿鸟尿捏聂孽啮镊镍涅您柠狞凝宁拧泞牛扭钮纽脓浓农弄奴努怒女暖虐疟挪懦糯诺哦欧鸥殴藕呕偶沤啪趴爬帕怕琶拍排牌徘湃派攀潘盘磐盼畔判叛乓庞旁耪胖抛咆刨炮袍跑泡呸胚培裴赔陪配佩沛喷盆砰抨烹澎彭蓬棚硼篷膨朋鹏捧碰坯砒霹批披劈琵毗啤脾疲皮匹痞僻屁譬篇偏片骗飘漂瓢票撇瞥拼频贫品聘乒坪苹萍平凭瓶评屏坡泼颇婆破魄迫粕剖扑铺仆莆葡菩蒲埔朴圃普浦谱曝瀑期欺栖戚妻七凄漆柒沏其棋奇歧畦崎脐齐旗祈祁骑起岂乞企启契砌器气迄弃汽泣讫掐洽牵扦钎铅千迁签仟谦乾黔钱钳前潜遣浅谴堑嵌欠歉枪呛腔羌墙蔷强抢橇锹敲悄桥瞧乔侨巧鞘撬翘峭俏窍切茄且怯窃钦侵亲秦琴勤芹擒禽寝沁青轻氢倾卿清擎晴氰情顷请庆琼穷秋丘邱球求囚酋泅趋区蛆曲躯屈驱渠取娶龋趣去圈颧权醛泉全痊拳犬券劝缺炔瘸却鹊榷确雀裙群然燃冉染瓤壤攘嚷让饶扰绕惹热壬仁人忍韧任认刃妊纫扔仍日戎茸蓉荣融熔溶容绒冗揉柔肉茹蠕儒孺如辱乳汝入褥软阮蕊瑞锐闰润若弱撒洒萨腮鳃塞赛三叁伞散桑嗓丧搔骚扫嫂瑟色涩森僧莎砂杀刹沙纱傻啥煞筛晒珊苫杉山删煽衫闪陕擅赡膳善汕扇缮墒伤商赏晌上尚裳梢捎稍烧芍勺韶少哨邵绍奢赊蛇舌舍赦摄射慑涉社设砷申呻伸身深娠绅神沈审婶甚肾慎渗声生甥牲升绳省盛剩胜圣师失狮施湿诗尸虱十石拾时什食蚀实识史矢使屎驶始式示士世柿事拭誓逝势是嗜噬适仕侍释饰氏市恃室视试收手首守寿授售受瘦兽蔬枢梳殊抒输叔舒淑疏书赎孰熟薯暑曙署蜀黍鼠属术述树束戍竖墅庶数漱恕刷耍摔衰甩帅栓拴霜双爽谁水睡税吮瞬顺舜说硕朔烁斯撕嘶思私司丝死肆寺嗣四伺似饲巳松耸怂颂送宋讼诵搜艘擞嗽苏酥俗素速粟僳塑溯宿诉肃酸蒜算虽隋随绥髓碎岁穗遂隧祟孙损笋蓑梭唆缩琐索锁所塌他它她塔獭挞蹋踏胎苔抬台泰酞太态汰坍摊贪瘫滩坛檀痰潭谭谈坦毯袒碳探叹炭汤塘搪堂棠膛唐糖倘躺淌趟烫掏涛滔绦萄桃逃淘陶讨套特藤腾疼誊梯剔踢锑提题蹄啼体替嚏惕涕剃屉天添填田甜恬舔腆挑条迢眺跳贴铁帖厅听烃汀廷停亭庭挺艇通桐酮瞳同铜彤童桶捅筒统痛偷投头透凸秃突图徒途涂屠土吐兔湍团推颓腿蜕褪退吞屯臀拖托脱鸵陀驮驼椭妥拓唾挖哇蛙洼娃瓦袜歪外豌弯湾玩顽丸烷完碗挽晚皖惋宛婉万腕汪王亡枉网往旺望忘妄威巍微危韦违桅围唯惟为潍维苇萎委伟伪尾纬未蔚味畏胃喂魏位渭谓尉慰卫瘟温蚊文闻纹吻稳紊问嗡翁瓮挝蜗涡窝我斡卧握沃巫呜钨乌污诬屋无芜梧吾吴毋武五捂午舞伍侮坞戊雾晤物勿务悟误昔熙析西硒矽晰嘻吸锡牺稀息希悉膝夕惜熄烯溪汐犀檄袭席习媳喜铣洗系隙戏细瞎虾匣霞辖暇峡侠狭下厦夏吓掀锨先仙鲜纤咸贤衔舷闲涎弦嫌显险现献县腺馅羡宪陷限线相厢镶香箱襄湘乡翔祥详想响享项巷橡像向象萧硝霄削哮嚣销消宵淆晓小孝校肖啸笑效楔些歇蝎鞋协挟携邪斜胁谐写械卸蟹懈泄泻谢屑薪芯锌欣辛新忻心信衅星腥猩惺兴刑型形邢行醒幸杏性姓兄凶胸匈汹雄熊休修羞朽嗅锈秀袖绣墟戌需虚嘘须徐许蓄酗叙旭序畜恤絮婿绪续轩喧宣悬旋玄选癣眩绚靴薛学穴雪血勋熏循旬询寻驯巡殉汛训讯逊迅压押鸦鸭呀丫芽牙蚜崖衙涯雅哑亚讶焉咽阉烟淹盐严研蜒岩延言颜阎炎沿奄掩眼衍演艳堰燕厌砚雁唁彦焰宴谚验殃央鸯秧杨扬佯疡羊洋阳氧仰痒养样漾邀腰妖瑶摇尧遥窑谣姚咬舀药要耀椰噎耶爷野冶也页掖业叶曳腋夜液一壹医揖铱依伊衣颐夷遗移仪胰疑沂宜姨彝椅蚁倚已乙矣以艺抑易邑屹亿役臆逸肄疫亦裔意毅忆义益溢诣议谊译异翼翌绎茵荫因殷音阴姻吟银淫寅饮尹引隐印英樱婴鹰应缨莹萤营荧蝇迎赢盈影颖硬映哟拥佣臃痈庸雍踊蛹咏泳涌永恿勇用幽优悠忧尤由邮铀犹油游酉有友右佑釉诱又幼迂淤于盂榆虞愚舆余俞逾鱼愉渝渔隅予娱雨与屿禹宇语羽玉域芋郁吁遇喻峪御愈欲狱育誉浴寓裕预豫驭鸳渊冤元垣袁原援辕园员圆猿源缘远苑愿怨院曰约越跃钥岳粤月悦阅耘云郧匀陨允运蕴酝晕韵孕匝砸杂栽哉灾宰载再在咱攒暂赞赃脏葬遭糟凿藻枣早澡蚤躁噪造皂灶燥责择则泽贼怎增憎曾赠扎喳渣札轧铡闸眨栅榨咋乍炸诈摘斋宅窄债寨瞻毡詹粘沾盏斩辗崭展蘸栈占战站湛绽樟章彰漳张掌涨杖丈帐账仗胀瘴障招昭找沼赵照罩兆肇召遮折哲蛰辙者锗蔗这浙珍斟真甄砧臻贞针侦枕疹诊震振镇阵蒸挣睁征狰争怔整拯正政帧症郑证芝枝支吱蜘知肢脂汁之织职直植殖执值侄址指止趾只旨纸志挚掷至致置帜峙制智秩稚质炙痔滞治窒中盅忠钟衷终种肿重仲众舟周州洲诌粥轴肘帚咒皱宙昼骤珠株蛛朱猪诸诛逐竹烛煮拄瞩嘱主著柱助蛀贮铸筑住注祝驻抓爪拽专砖转撰赚篆桩庄装妆撞壮状椎锥追赘坠缀谆准捉拙卓桌琢茁酌啄着灼浊兹咨资姿滋淄孜紫仔籽滓子自渍字鬃棕踪宗综总纵邹走奏揍租足卒族祖诅阻组钻纂嘴醉最罪尊遵昨左佐柞做作坐座';
    }

    function ftPYStr() {
        return '啊阿埃挨哎唉哀皚癌藹矮艾礙愛隘鞍氨安俺按暗岸胺案肮昂盎凹敖熬翺襖傲奧懊澳芭捌扒叭吧笆八疤巴拔跋靶把耙壩霸罷爸白柏百擺佰敗拜稗斑班搬扳般頒板版扮拌伴瓣半辦絆邦幫梆榜膀綁棒磅蚌鎊傍謗苞胞包褒剝薄雹保堡飽寶抱報暴豹鮑爆杯碑悲卑北輩背貝鋇倍狽備憊焙被奔苯本笨崩繃甭泵蹦迸逼鼻比鄙筆彼碧蓖蔽畢斃毖幣庇痹閉敝弊必辟壁臂避陛鞭邊編貶扁便變卞辨辯辮遍標彪膘表鼈憋別癟彬斌瀕濱賓擯兵冰柄丙秉餅炳病並玻菠播撥缽波博勃搏鉑箔伯帛舶脖膊渤泊駁捕蔔哺補埠不布步簿部怖擦猜裁材才財睬踩采彩菜蔡餐參蠶殘慚慘燦蒼艙倉滄藏操糙槽曹草廁策側冊測層蹭插叉茬茶查碴搽察岔差詫拆柴豺攙摻蟬饞讒纏鏟産闡顫昌猖場嘗常長償腸廠敞暢唱倡超抄鈔朝嘲潮巢吵炒車扯撤掣徹澈郴臣辰塵晨忱沈陳趁襯撐稱城橙成呈乘程懲澄誠承逞騁秤吃癡持匙池遲弛馳恥齒侈尺赤翅斥熾充衝沖蟲崇寵抽酬疇躊稠愁籌仇綢瞅醜臭初出櫥廚躇鋤雛滁除楚礎儲矗搐觸處揣川穿椽傳船喘串瘡窗幢床闖創吹炊捶錘垂春椿醇唇淳純蠢戳綽疵茨磁雌辭慈瓷詞此刺賜次聰蔥囪匆從叢湊粗醋簇促躥篡竄摧崔催脆瘁粹淬翠村存寸磋撮搓措挫錯搭達答瘩打大呆歹傣戴帶殆代貸袋待逮怠耽擔丹單鄲撣膽旦氮但憚淡誕彈蛋當擋黨蕩檔刀搗蹈倒島禱導到稻悼道盜德得的蹬燈登等瞪凳鄧堤低滴迪敵笛狄滌翟嫡抵底地蒂第帝弟遞締顛掂滇碘點典靛墊電佃甸店惦奠澱殿碉叼雕凋刁掉吊釣調跌爹碟蝶叠諜疊丁盯叮釘頂鼎錠定訂丟東冬董懂動棟侗恫凍洞兜抖鬥陡豆逗痘都督毒犢獨讀堵睹賭杜鍍肚度渡妒端短鍛段斷緞堆兌隊對墩噸蹲敦頓囤鈍盾遁掇哆多奪垛躲朵跺舵剁惰墮蛾峨鵝俄額訛娥惡厄扼遏鄂餓恩而兒耳爾餌洱二貳發罰筏伐乏閥法琺藩帆番翻樊礬釩繁凡煩反返範販犯飯泛坊芳方肪房防妨仿訪紡放菲非啡飛肥匪誹吠肺廢沸費芬酚吩氛分紛墳焚汾粉奮份忿憤糞豐封楓蜂峰鋒風瘋烽逢馮縫諷奉鳳佛否夫敷膚孵扶拂輻幅氟符伏俘服浮涪福袱弗甫撫輔俯釜斧脯腑府腐赴副覆賦複傅付阜父腹負富訃附婦縛咐噶嘎該改概鈣蓋溉幹甘杆柑竿肝趕感稈敢贛岡剛鋼缸肛綱崗港杠篙臯高膏羔糕搞鎬稿告哥歌擱戈鴿胳疙割革葛格蛤閣隔鉻個各給根跟耕更庚羹埂耿梗工攻功恭龔供躬公宮弓鞏汞拱貢共鈎勾溝苟狗垢構購夠辜菇咕箍估沽孤姑鼓古蠱骨谷股故顧固雇刮瓜剮寡挂褂乖拐怪棺關官冠觀管館罐慣灌貫光廣逛瑰規圭矽歸龜閨軌鬼詭癸桂櫃跪貴劊輥滾棍鍋郭國果裹過哈骸孩海氦亥害駭酣憨邯韓含涵寒函喊罕翰撼捍旱憾悍焊汗漢夯杭航壕嚎豪毫郝好耗號浩呵喝荷菏核禾和何合盒貉閡河涸赫褐鶴賀嘿黑痕很狠恨哼亨橫衡恒轟哄烘虹鴻洪宏弘紅喉侯猴吼厚候後呼乎忽瑚壺葫胡蝴狐糊湖弧虎唬護互滬戶花嘩華猾滑畫劃化話槐徊懷淮壞歡環桓還緩換患喚瘓豢煥渙宦幻荒慌黃磺蝗簧皇凰惶煌晃幌恍謊灰揮輝徽恢蛔回毀悔慧卉惠晦賄穢會燴彙諱誨繪葷昏婚魂渾混豁活夥火獲或惑霍貨禍擊圾基機畸稽積箕肌饑迹激譏雞姬績緝吉極棘輯籍集及急疾汲即嫉級擠幾脊己薊技冀季伎祭劑悸濟寄寂計記既忌際妓繼紀嘉枷夾佳家加莢頰賈甲鉀假稼價架駕嫁殲監堅尖箋間煎兼肩艱奸緘繭檢柬堿鹼揀撿簡儉剪減薦檻鑒踐賤見鍵箭件健艦劍餞漸濺澗建僵姜將漿江疆蔣槳獎講匠醬降蕉椒礁焦膠交郊澆驕嬌嚼攪鉸矯僥腳狡角餃繳絞剿教酵轎較叫窖揭接皆稭街階截劫節莖睛晶鯨京驚精粳經井警景頸靜境敬鏡徑痙靖竟競淨炯窘揪究糾玖韭久灸九酒廄救舊臼舅咎就疚鞠拘狙疽居駒菊局咀矩舉沮聚拒據巨具距踞鋸俱句懼炬劇捐鵑娟倦眷卷絹撅攫抉掘倔爵桔傑捷睫竭潔結解姐戒藉芥界借介疥誡屆巾筋斤金今津襟緊錦僅謹進靳晉禁近燼浸盡勁荊兢覺決訣絕均菌鈞軍君峻俊竣浚郡駿喀咖卡咯開揩楷凱慨刊堪勘坎砍看康慷糠扛抗亢炕考拷烤靠坷苛柯棵磕顆科殼咳可渴克刻客課肯啃墾懇坑吭空恐孔控摳口扣寇枯哭窟苦酷庫褲誇垮挎跨胯塊筷儈快寬款匡筐狂框礦眶曠況虧盔巋窺葵奎魁傀饋愧潰坤昆捆困括擴廓闊垃拉喇蠟臘辣啦萊來賴藍婪欄攔籃闌蘭瀾讕攬覽懶纜爛濫琅榔狼廊郎朗浪撈勞牢老佬姥酪烙澇勒樂雷鐳蕾磊累儡壘擂肋類淚棱楞冷厘梨犁黎籬狸離漓理李裏鯉禮莉荔吏栗麗厲勵礫曆利傈例俐痢立粒瀝隸力璃哩倆聯蓮連鐮廉憐漣簾斂臉鏈戀煉練糧涼梁粱良兩輛量晾亮諒撩聊僚療燎寥遼潦了撂鐐廖料列裂烈劣獵琳林磷霖臨鄰鱗淋凜賃吝拎玲菱零齡鈴伶羚淩靈陵嶺領另令溜琉榴硫餾留劉瘤流柳六龍聾嚨籠窿隆壟攏隴樓婁摟簍漏陋蘆盧顱廬爐擄鹵虜魯麓碌露路賂鹿潞祿錄陸戮驢呂鋁侶旅履屢縷慮氯律率濾綠巒攣孿灤卵亂掠略掄輪倫侖淪綸論蘿螺羅邏鑼籮騾裸落洛駱絡媽麻瑪碼螞馬罵嘛嗎埋買麥賣邁脈瞞饅蠻滿蔓曼慢漫謾芒茫盲氓忙莽貓茅錨毛矛鉚卯茂冒帽貌貿麽玫枚梅酶黴煤沒眉媒鎂每美昧寐妹媚門悶們萌蒙檬盟錳猛夢孟眯醚靡糜迷謎彌米秘覓泌蜜密冪棉眠綿冕免勉娩緬面苗描瞄藐秒渺廟妙蔑滅民抿皿敏憫閩明螟鳴銘名命謬摸摹蘑模膜磨摩魔抹末莫墨默沫漠寞陌謀牟某拇牡畝姆母墓暮幕募慕木目睦牧穆拿哪呐鈉那娜納氖乃奶耐奈南男難囊撓腦惱鬧淖呢餒內嫩能妮霓倪泥尼擬你匿膩逆溺蔫拈年碾攆撚念娘釀鳥尿捏聶孽齧鑷鎳涅您檸獰凝甯擰濘牛扭鈕紐膿濃農弄奴努怒女暖虐瘧挪懦糯諾哦歐鷗毆藕嘔偶漚啪趴爬帕怕琶拍排牌徘湃派攀潘盤磐盼畔判叛乓龐旁耪胖抛咆刨炮袍跑泡呸胚培裴賠陪配佩沛噴盆砰抨烹澎彭蓬棚硼篷膨朋鵬捧碰坯砒霹批披劈琵毗啤脾疲皮匹痞僻屁譬篇偏片騙飄漂瓢票撇瞥拼頻貧品聘乒坪蘋萍平憑瓶評屏坡潑頗婆破魄迫粕剖撲鋪仆莆葡菩蒲埔樸圃普浦譜曝瀑期欺棲戚妻七淒漆柒沏其棋奇歧畦崎臍齊旗祈祁騎起豈乞企啓契砌器氣迄棄汽泣訖掐洽牽扡釺鉛千遷簽仟謙乾黔錢鉗前潛遣淺譴塹嵌欠歉槍嗆腔羌牆薔強搶橇鍬敲悄橋瞧喬僑巧鞘撬翹峭俏竅切茄且怯竊欽侵親秦琴勤芹擒禽寢沁青輕氫傾卿清擎晴氰情頃請慶瓊窮秋丘邱球求囚酋泅趨區蛆曲軀屈驅渠取娶齲趣去圈顴權醛泉全痊拳犬券勸缺炔瘸卻鵲榷確雀裙群然燃冉染瓤壤攘嚷讓饒擾繞惹熱壬仁人忍韌任認刃妊紉扔仍日戎茸蓉榮融熔溶容絨冗揉柔肉茹蠕儒孺如辱乳汝入褥軟阮蕊瑞銳閏潤若弱撒灑薩腮鰓塞賽三三傘散桑嗓喪搔騷掃嫂瑟色澀森僧莎砂殺刹沙紗傻啥煞篩曬珊苫杉山刪煽衫閃陝擅贍膳善汕扇繕墒傷商賞晌上尚裳梢捎稍燒芍勺韶少哨邵紹奢賒蛇舌舍赦攝射懾涉社設砷申呻伸身深娠紳神沈審嬸甚腎慎滲聲生甥牲升繩省盛剩勝聖師失獅施濕詩屍虱十石拾時什食蝕實識史矢使屎駛始式示士世柿事拭誓逝勢是嗜噬適仕侍釋飾氏市恃室視試收手首守壽授售受瘦獸蔬樞梳殊抒輸叔舒淑疏書贖孰熟薯暑曙署蜀黍鼠屬術述樹束戍豎墅庶數漱恕刷耍摔衰甩帥栓拴霜雙爽誰水睡稅吮瞬順舜說碩朔爍斯撕嘶思私司絲死肆寺嗣四伺似飼巳松聳慫頌送宋訟誦搜艘擻嗽蘇酥俗素速粟僳塑溯宿訴肅酸蒜算雖隋隨綏髓碎歲穗遂隧祟孫損筍蓑梭唆縮瑣索鎖所塌他它她塔獺撻蹋踏胎苔擡台泰酞太態汰坍攤貪癱灘壇檀痰潭譚談坦毯袒碳探歎炭湯塘搪堂棠膛唐糖倘躺淌趟燙掏濤滔縧萄桃逃淘陶討套特藤騰疼謄梯剔踢銻提題蹄啼體替嚏惕涕剃屜天添填田甜恬舔腆挑條迢眺跳貼鐵帖廳聽烴汀廷停亭庭挺艇通桐酮瞳同銅彤童桶捅筒統痛偷投頭透凸禿突圖徒途塗屠土吐兔湍團推頹腿蛻褪退吞屯臀拖托脫鴕陀馱駝橢妥拓唾挖哇蛙窪娃瓦襪歪外豌彎灣玩頑丸烷完碗挽晚皖惋宛婉萬腕汪王亡枉網往旺望忘妄威巍微危韋違桅圍唯惟爲濰維葦萎委偉僞尾緯未蔚味畏胃餵魏位渭謂尉慰衛瘟溫蚊文聞紋吻穩紊問嗡翁甕撾蝸渦窩我斡臥握沃巫嗚鎢烏汙誣屋無蕪梧吾吳毋武五捂午舞伍侮塢戊霧晤物勿務悟誤昔熙析西硒矽晰嘻吸錫犧稀息希悉膝夕惜熄烯溪汐犀檄襲席習媳喜銑洗系隙戲細瞎蝦匣霞轄暇峽俠狹下廈夏嚇掀鍁先仙鮮纖鹹賢銜舷閑涎弦嫌顯險現獻縣腺餡羨憲陷限線相廂鑲香箱襄湘鄉翔祥詳想響享項巷橡像向象蕭硝霄削哮囂銷消宵淆曉小孝校肖嘯笑效楔些歇蠍鞋協挾攜邪斜脅諧寫械卸蟹懈泄瀉謝屑薪芯鋅欣辛新忻心信釁星腥猩惺興刑型形邢行醒幸杏性姓兄凶胸匈洶雄熊休修羞朽嗅鏽秀袖繡墟戌需虛噓須徐許蓄酗敘旭序畜恤絮婿緒續軒喧宣懸旋玄選癬眩絢靴薛學穴雪血勳熏循旬詢尋馴巡殉汛訓訊遜迅壓押鴉鴨呀丫芽牙蚜崖衙涯雅啞亞訝焉咽閹煙淹鹽嚴研蜒岩延言顔閻炎沿奄掩眼衍演豔堰燕厭硯雁唁彥焰宴諺驗殃央鴦秧楊揚佯瘍羊洋陽氧仰癢養樣漾邀腰妖瑤搖堯遙窯謠姚咬舀藥要耀椰噎耶爺野冶也頁掖業葉曳腋夜液一壹醫揖銥依伊衣頤夷遺移儀胰疑沂宜姨彜椅蟻倚已乙矣以藝抑易邑屹億役臆逸肄疫亦裔意毅憶義益溢詣議誼譯異翼翌繹茵蔭因殷音陰姻吟銀淫寅飲尹引隱印英櫻嬰鷹應纓瑩螢營熒蠅迎贏盈影穎硬映喲擁傭臃癰庸雍踴蛹詠泳湧永恿勇用幽優悠憂尤由郵鈾猶油遊酉有友右佑釉誘又幼迂淤于盂榆虞愚輿余俞逾魚愉渝漁隅予娛雨與嶼禹宇語羽玉域芋郁籲遇喻峪禦愈欲獄育譽浴寓裕預豫馭鴛淵冤元垣袁原援轅園員圓猿源緣遠苑願怨院曰約越躍鑰嶽粵月悅閱耘雲鄖勻隕允運蘊醞暈韻孕匝砸雜栽哉災宰載再在咱攢暫贊贓髒葬遭糟鑿藻棗早澡蚤躁噪造皂竈燥責擇則澤賊怎增憎曾贈紮喳渣劄軋鍘閘眨柵榨咋乍炸詐摘齋宅窄債寨瞻氈詹粘沾盞斬輾嶄展蘸棧占戰站湛綻樟章彰漳張掌漲杖丈帳賬仗脹瘴障招昭找沼趙照罩兆肇召遮折哲蟄轍者鍺蔗這浙珍斟真甄砧臻貞針偵枕疹診震振鎮陣蒸掙睜征猙爭怔整拯正政幀症鄭證芝枝支吱蜘知肢脂汁之織職直植殖執值侄址指止趾只旨紙志摯擲至致置幟峙制智秩稚質炙痔滯治窒中盅忠鍾衷終種腫重仲衆舟周州洲謅粥軸肘帚咒皺宙晝驟珠株蛛朱豬諸誅逐竹燭煮拄矚囑主著柱助蛀貯鑄築住注祝駐抓爪拽專磚轉撰賺篆樁莊裝妝撞壯狀椎錐追贅墜綴諄准捉拙卓桌琢茁酌啄著灼濁茲咨資姿滋淄孜紫仔籽滓子自漬字鬃棕蹤宗綜總縱鄒走奏揍租足卒族祖詛阻組鑽纂嘴醉最罪尊遵昨左佐柞做作坐座';
    }

    String.prototype.traditionalized = function () {
        var str = '';
        for (var i = 0; i < this.length; i++) {
            if (charPYStr().indexOf(this.charAt(i)) != -1)
                str += ftPYStr().charAt(charPYStr().indexOf(this.charAt(i)));
            else
                str += this.charAt(i);
        }
        return str;
    }

    String.prototype.simplized = function () {
        var str = '';
        for (var i = 0; i < this.length; i++) {
            if (ftPYStr().indexOf(this.charAt(i)) != -1)
                str += charPYStr().charAt(ftPYStr().indexOf(this.charAt(i)));
            else
                str += this.charAt(i);
        }
        return str;
    }

})
//翻译
function trans(ln) {
    sessionStorage.setItem('lange', ln)
    settrans();
}

function setlange(str) {
    var ln = sessionStorage.getItem('lange');
    if (ln == 'zh') {
        return str.traditionalized();
    } else if (ln == 'cn') {
        return str.simplized()
    }
}
function settrans($parent) {
    var ln = sessionStorage.getItem('lange');

    if (ln == 'en') {//英文
        //           i18next.changeLanguage('en')
    } else if (ln == 'chs') {//简体中文

        //i18next.changeLanguage('cn')
        if (typeof($parent) == 'string') {
            return $parent;
        }
        //$('[data-tran]', $parent).each(function (index, item) {
        //    if (this.tagName == 'INPUT' || this.tagName == 'TEXTAREA') {
        //        if (this.value == '') {
        //            this.placeholder = this.placeholder.simplized()
        //        } else if (this.value == '搜索') {
        //            this.value = this.value.simplized();
        //        }
        //    } else {
        //        var content = this.innerHTML
        //        $(this).html(content.simplized());
        //    }
        //})
    } else if (ln == 'cht') {//繁体

        if (typeof($parent) == 'string') {
            return $parent.traditionalized();
        }
        $('[data-tran]', $parent).each(function (index, item) {
            if (this.tagName == 'INPUT' || this.tagName == 'TEXTAREA') {
                if (this.value == '') {
                    this.placeholder = this.placeholder.traditionalized()
                }
            } else {
                var content = item.innerHTML
                $(this).html(content.traditionalized());
            }

        })
    } else {
        if (typeof($parent) == 'string') {
            return $parent;
        }
    }
}

//类数组转数组
function listToArrary(likeAry) {
    var ary = [];
    try {
        ary = Array.prototype.slice.call(likeAry, 0);//在ie6-ie8 不兼容，报错
    }
    catch (e) {// e 表示rror的一个实例
        for (var i = 0; i < likeAry.length; i++) {
            ary[ary.length] = likeAry[i];
        }
    }
    finally {
    }
    return ary
};

$(function () {
    document.ondrop = function (e) {
        e.preventDefault();
        mystopPropagation(e)
    }
    document.ondragover = function (e) {
        e.preventDefault();
        mystopPropagation(e)
    }
})
//打开邮箱
function openEmail(parm) {
    //var parm = {email: this.innerHTML};


    var promise = new Promise(function (resolve, reject) {
        try {
            //var parm = {};
            window.lxpc.exebusinessaction('PersonCard', 'SendEmail', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {

                if (status == 0) {
                    resolve(status)
                } else {
                    my_layer({message: '网络异常'}, 'warn')
                    reject(status)
                }
            })
        }
        catch (e) {
            my_layer({message: '调取接口出错，错误码：' + e.message}, 'error')
            reject(e.message)

        }
    })
    return promise

}

//取消下载
 function StopDownloadReource (parm) {
    //var parm={stopResMark:[{ 'ec006816-8f3d-4309-be04-3dc3ed61ab7b':45645}]}

     try {
         window.lxpc.exebusinessaction('DownloadResource', 'StopDownloadReource', '0', JSON.stringify(parm), 0, function (status, result, targ) {

         })

     } catch (e) {
         console.log(e.message)
     }

}

//停止上传
 function StopUploadReource (parm) {
    //var parm = {stopResMark: stoptarg}
    //var parm={stopResMark:[{ 'ec006816-8f3d-4309-be04-3dc3ed61ab7b':45645}]}

    try {
        window.lxpc.exebusinessaction('UploadResource', 'StopUploadReource', '0', JSON.stringify(parm), 0, function (status, result, targ) {

        })

    } catch (e) {
        console.log(e.message)
    }
}
//解析URL参数
function getUrlParm(){
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}


//接受转发联系人
 function ReceiveSelectPeople (handle, cb) {
    var _this = this;

    try {
        var parm = {}

        window.lxpc.exebusinessaction(handle, 'ReceiveSelectPeople', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {

            if (status == 0) {
                var data = JSON.parse(jsondata)

                if (Object.prototype.toString.call(cb) == '[object Function]') {

                    cb(data)
                }


            } else {

                my_layer({message: '网络异常'}, 'warn')
            }

        })
    } catch (e) {
        my_layer({message: '调用接口异常，错误码' + e.message}, 'error')
    }


}
function SelectPeople(handle,parm){
    try {
    //var code = _this.initInfo.code;
    //var parm = {fromCode: code, orgDomain: _this.initInfo.orgDomain}
    window.lxpc.exebusinessaction(handle, 'onlySelectPeople', '0', JSON.stringify(parm), 0, function (status, jsondata, targ) {
        if (status == 0) {


        } else {

            my_layer({message: '网络异常'}, 'warn')
        }

    })


} catch (e) {
    my_layer({message: '调用接口错误，错误码' + e.message})
}
}

function ReceiveIframeWebCall(handle) {
    return new Promise(function(resolve, reject){
        try {
            window.lxpc.exebusinessaction(handle, 'ReceiveIframeWebCall', '0', JSON.stringify({}), 0, function (status, result, targ) {
                if (status == 0) {
                    console.log('成功==========================================')
                    resolve(JSON.parse(result)||null)
                }else {
                    reject(status)
                }
            })
        }catch (e){
            reject(e.message)
        }
    })

}

