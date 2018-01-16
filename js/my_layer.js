function my_layer(option, type, cbok, cbcancle) {

    var opt_def = {title: '蓝信', icon: '/images/ic_tip1.png', message: '是否关闭当前窗口', tip: false};
    var opt = jQuery.extend(opt_def, option);

    //邮箱
    var  reg=/[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}/g;

    if(reg.test(opt.message)){
        opt.message=opt.message.replace(reg,function(){
              return '<a class="layer_aV_a" onclick="emial(this)">'+arguments[0]+'</a>'
        })
    }

    var str = '';
    str += '<div class="mark"></div><div class="layer_box"  ><div class="layer_top" data-tran>' + opt.title + ' <em></em></div>';
    str += '<div class="layer_wrap"><div style="padding:20px;height: 34px;font-size: 0"><img src="' + opt.icon + '" alt="" style="display: inline-block;vertical-align: middle">'
    str += '<span style="font-size:14px;color: #000;word-break: break-all;overflow: hidden;" data-tran>' + opt.message + '</span></div></div>'
    //str+='<div class="layer_footer"><em class="layer_check"></em><input type="checkbox" name="tip" id="tip"><label for="tip">不再提示</label>';
    str += '<div class="layer_footer">';

    if (opt.tip) {

        str += '<em class="layer_check"></em><input type="checkbox" name="tip" class="tip"><label for="tip" data-tran>不再提示</label>'
    }

    if (type == 'confirm') {
        str += '<button  class="btn_n  btn_ok" data-tran>确定</button><button  class="btn_n btn_qx" data-tran>取消</button></div></div>';
    } else {
        str += '<button  class="btn_n  btn_ok" data-tran>确定</button></div></div>';
    }
    var box = $(str).appendTo('body');

    settrans(box)

    //if($.fn.draggable){
    //
    //    box.draggable({scroll: false})
    //}
    if (opt.tip) {
        $('.tip', box).change(function () {
            if (this.checked) {
                $('.layer_check', box).addClass('layer_checked')

            } else {
                $('.layer_check', box).removeClass('layer_checked')
            }
        });

    }


    //类型为alert
    var $img = $('.layer_wrap img', box),
        $btn_qx = $('.btn_qx', box)
    if (type == 'success') {
        $img.attr('src', './images/ic_tip4.png');
        $btn_qx.hide();

    } else if (type == 'error') {
        $img.attr('src', './images/ic_tip3.png');
        $btn_qx.hide();
    } else if (type == 'warn') {
        $img.attr('src', './images/ic_tip2.png');
        $btn_qx.hide();
    } else {
        $img.attr('src', './images/ic_tip5.png');
    }

    $('.btn_ok', box).click(function () {
        box.remove();
        if (Object.prototype.toString.call(cbok) == '[object Function]') {

            cbok();
        }
    })


    $('.btn_qx', box).on('click', function () {
        box.remove();
        if (Object.prototype.toString.call(cbcancle) == '[object Function]') {
            cbcancle();
        }
    })

    $('.layer_top em', box).click(function () {
        box.remove();

        if (type == 'confirm') {
            if (Object.prototype.toString.call(cbcancle) == '[object Function]') {
                cbcancle();
            }
        } else {
            if (Object.prototype.toString.call(cbok) == '[object Function]') {
                cbok();
            }
        }

    })


}
function emial(ele) {
    var parm = {email: ele.innerHTML};
    openEmail(parm)
}
