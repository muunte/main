/**
 * checkbox all checked and cancel
 */
$(function() {
        //common_pro_list  glike 事件
        $('.glike').click(function(event){
            var _this = $(this);
            var userid = '<{$user_id}>';
            var _val  = parseInt(_this.find('font').text());
            var goods_id = _this.attr('data_id');
            if(!userid){
                _this.tip("Please Login!", 15, 0, 2000);
                return false;
            }
            $.ajax({
                url :'/h-user-addFavorites.html',
                type:'POST',
                data:{
                    goods_id : goods_id                                         
                },
                dataType: 'json',
                cache: false,
                success: function(res) {
                    if(res == 1){
                        _this.tip('Add to favorite succeed.', 15, 0, 2000); 
                        _this.find('font').text(_val+1);
                    }else if(res== 2){
                        _this.tip('Please Login first', 15, 0, 2000); 
                    }else if(res== 3){
                        _this.tip('Already added', 15, 0, 2000); 
                    }else{
                        _this.tip('Add to favorite failed.', 15, 0, 2000); 
                    }
                },
                error:function(){
                    alert('Connection failed, please refresh');
                },
                beforeSend: function(){
                    createAjaxLoading();
                },
                complete: function(){
                    removeAjaxLoading();
                }
            })
            event.stopPropagation();
        });

});
function checkUrl(value) {
    // contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
    return  /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
}
function checkEmail(value) {
    // contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
    return  /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
}
/**
 * 图片缩略函数
 */
function resizeimg(img, target_w, target_h) {
    var tarW = target_w ? target_w : 100;
    var tarH = target_h ? target_h : 100;
    var imgW = img.width;
    var imgH = img.height;

    var widthRatio = 1;
    var widthTag = false;
    var heightRatio = 1;
    var heightTag = false;

    var ratio = 1;

    if (imgW > tarW || imgH > tarH) {
        if (imgW > tarW) {
            widthRatio = tarW / imgW;
            widthTag = true;
        }
        if (imgH > tarH) {
            heightRatio = tarH / imgH;
            heightTag = true;
        }
        if (widthTag && heightTag) {
            if (widthRatio > heightRatio) {
                ratio = heightRatio;
            } else {
                ratio = widthRatio;
            }
        }
        if (!widthTag && heightTag) {
            ratio = heightRatio;
        }
        if (widthTag && !heightTag) {
            ratio = widthTag;
        }
    } else {
        if (tarW > tarH) {
            ratio = tarW / imgW;
        } else {
            ratio = tarH / imgH;
        }
    }

    img.width = imgW * ratio;
    img.heigt = imgH * ratio;
}
var userFastLoginCallback = null;
var userFastLoginDialog = null;
var userFastLogin = function() {
    return {
        exec: function(callback) {
            userFastLoginCallback = callback;
            $.ajax({
                url: '/index.php?m=home&c=user&a=isLoginAjax',
                type: 'GET',
                dataType: 'json',
                cache: false,
                async: false,
                success: function(retdat) {
                    if (retdat.status == 1) {
                        userFastLoginCallback(retdat.user);
                    } else {
                        if (userFastLoginDialog == null) {
                            $.ajax({
                                url: '/index.php?m=home&c=user&a=loginAjax',
                                type: 'GET',
                                dataType: 'html',
                                cache: false,
                                //async: false,
                                success: function(retdat) {
                                    $('body').append(retdat);
                                    userFastLoginDialog = $('#dlgUserFastLogin').dialog({
                                        drag: 'div.dlg-header',
                                        buttons: '.dlg-close'
                                    });
                                    userFastLoginDialog.open();
                                },
                                beforeSend: function(){
                                    createAjaxLoading();
                                },
                                complete: function(){
                                    removeAjaxLoading();
                                }
                            });
                        } else {
                            userFastLoginDialog.open();
                        }
                    }
                }
            });
        }
    };
}();


var shareGoodsDialog = null;
var shareGoods = function() {
    return {
        exec: function(goods_id) {
            if (shareGoodsDialog == null) {
                $.ajax({
                    url: '/h-product-share.html?goods_id='+goods_id,
                    type: 'GET',
                    dataType: 'html',
                    cache: false,
                    //async: false,
                    success: function(retdat) {
                        $('body').append(retdat);
                        shareGoodsDialog = $('#goods_share_box').dialog({
                            drag: '.share-header',
                            buttons: '.close_box'
                        });
                        shareGoodsDialog.open();
                    },
                    beforeSend: function(){
                        createAjaxLoading();
                    },
                    complete: function(){
                        removeAjaxLoading();
                    }
                });
            } else {
                shareGoodsDialog.open();
            }
        }
    };
}();

function createAjaxLoading()
{
    $('<div/>').appendTo(document.body).addClass('ajax_loading');
}
function removeAjaxLoading()
{
    $('.ajax_loading').remove();
}

function pad(num, decimal, type) {
    if(decimal==0)
        return num;
    var type = type ? type : 0;
    var arrnum = num.split('.');
    if (arrnum[1]) {
        if (arrnum[1].length < decimal) {
            var str = '';
            for (var i = 0; i < decimal - arrnum[1].length; i++) {
                str += '0';
            }
            num = num + str;
        }
    } else {
        if (type == 1) {
            if (num.length < decimal) {
                var str = '';
                for (var i = 0; i < decimal - num.length; i++) {
                    str += '0';
                }
                num = num + str;
            }
        } else {
            var str = '';
            for (var i = 0; i < decimal; i++) {
                str += '0';
            }
            num = num + '.' + str;
        }
    }
    return num;
}