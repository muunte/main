/*气泡提示
在指定元素上显示tip
$(对象).tip(文本[, 偏移x, 偏移y, 自动消失时间]);
也可以手动消失
$().tip.hide();
ex:
$('button').hover(function (){
	$(this).tip('您的输入有误(<b>点击消失</b>)!', -10, 0);
}, $.noop).click(function (){
	$(this).tip.hide();
});
*/
(function ($){
	var $tip;
	var html = '<div class="popup-tip-all"><div class="popup-tip-arrows"></div><div class="popup-tip-body"></div></div>';
	var upCss = 'popup-tip-arrows-up';
	var timeId;
	function pos(el) {
		var R = el.getBoundingClientRect(),	r = {};
		var d = document, dd = d.documentElement, db = d.body, X = Math.max;
		for (var k in R) r[k] = R[k];
		r.left += X(dd.scrollLeft, db.scrollLeft) - (dd.clientLeft || db.clientLeft || 0);
		r.top += X(dd.scrollTop, db.scrollTop) - (dd.clientTop || db.clientTop || 0);
		return r
	}
	function createTip(){
		if (!$tip) {
			$tip = $(html).appendTo(document.body);
		}
	}
	$.fn.tip = function (str, x, y, showTime){
		var $self = this.eq(0);
		x = x || 0;
		y = y || 0;
		createTip();
		clearTimeout(timeId);
		var offset = pos($self.get(0));
		$tip.find('div.popup-tip-body').html(str);
		$tip.show().stop().css({
			opacity: 1,
			left: offset.left + x,	
			top: offset.top - $tip.height() - 2 + y
		});
		if (showTime) {
			timeId = setTimeout(function() {
				$tip.fadeOut();
			}, showTime);			
		}
	}
	$.fn.tip.hide = function (){
		$tip.fadeOut();
		return this;
	}
})(jQuery);