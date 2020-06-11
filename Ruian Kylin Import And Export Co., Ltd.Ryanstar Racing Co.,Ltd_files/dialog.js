(function ($){

	function style(t) {
		var k,doc = document,
		hd = $('head')[0],
		h = hd || doc.documentElement,
		s = h.getElementsByTagName("style");
		if (s.length === 0) {
            if (doc.createStyleSheet) {
                k = doc.createStyleSheet()
            }else{
                k = doc.createElement('style');
                k.type = 'text/css';
				h.appendChild(k);
            }
		}
		k = s[s.length - 1];
		if (k.styleSheet) {
			k.styleSheet.cssText += t;
		} else {
            k.appendChild(doc.createTextNode(t));
		}
	};

	var css = '.overlay{' + 
		'top:0;left:0;z-index:10000;' + 
		'width:100%;height:100%;' + 'background:#000;' + 
		'filter:alpha(opacity=30);opacity:0.3;' + 
		'position:fixed;display:none;}';
	var winZ = 9e3;
	var topZ = 9e5;
	var dlgZ = 9e4;
	var maskLay;
	var IE6 = $.isIE6 = $.browser.msie && $.browser.version < 7;
	if (IE6) {
		css += 'html body {margin:0;height:100%}' +
		'.ie6_overlay select {visibility:hidden}' +
		'.ie6_overlay_show select {_visibility:visible;}' +
		'.overlay {position: absolute;' +
		'left: expression(documentElement.scrollLeft +' +
		'documentElement.clientWidth - this.offsetWidth);' +
		'top: expression(documentElement.scrollTop + ' +
		'documentElement.clientHeight - this.offsetHeight);}';
	}
	style(css);

	function MaskLay(){
		var _self = this;
		this.layer = $('<div/>').addClass("overlay").appendTo(document.body);
		this.layer.attr('tabIndex', '-1');
		this.binds = [];
		this.layer.bind('click', function(e) {
			_self.onclick();
		});
	}

	MaskLay.prototype = {
		onclick: $.noop,
		onshow: $.noop,
		onhide: $.noop,
		css: function() {
			this.layer.css.apply(this.layer, arguments);
			return this;
		},
		clean: function (){
			var binds = [];
			for (var i =  this.binds.length; i--;) {
				var el = this.binds[i];
				if (el.parentNode && el.style.display != 'none') {
					binds.push(el);
				}
			}
			this.binds = binds;
		},
		_del: function (el){
			for (var i = this.binds.length; i--;) {
				if (this.binds[i] === el) {
					this.binds.splice(i, 1);
				}
			}
		},
		show: function(dlg) {
			this.layer.show();
			this.visable = true;
			this.layer.get(0).focus();
			if (IE6) {
				$(document.body).addClass('ie6_overlay');
			}
			var el = $(dlg)[0], z, idx;
			if (el) {
				this.currentDlg = el;
				this._del(el);
				this.binds.push(el);
				z = $(el).css('zIndex') - 1;
			} else {
				z = winZ++;
			}
			this.layer.css('zIndex', z);
			this.onshow(el);
			return this;
		},
		hide: function() {
			this.visable = false;
			this.clean();
			var L = this.binds.length;
			if (L) {
				this.show(this.binds[L - 1]);
			} else {
				if (IE6) {
					$(document.body).addClass('ie6_overlay');
				}
				this.currentLay = false;
				this.layer.hide();
				this.onhide();
			}
			return this;
		}
	};

	function getMaskLay(){
		if (!maskLay) {
			maskLay = new MaskLay();
		}
		return maskLay;
	}

	$.viewport = function() {
		var b = document.body,
		c = document.documentElement,
		d = Math.max;
		return {
			width: c.clientWidth || b.clientWidth,
			height: c.clientHeight || b.clientHeight,
			left: d(c.scrollLeft, b.scrollLeft),
			top: d(c.scrollTop, b.scrollTop)
		};
	};

	function Drag(ini){
		var _self = this;
		this.handle = $(ini.handle);
		if (this.handle.size() == 0 || this.handle.data('dragOn')) {
			throw Error('handle is null, or drag is seted!');
		}
		this.handle.data('dragOn', true);
		this.layer = ini.layer ? $(ini.layer) : this.handle;
		this.isFixed = this.layer.css('position') == 'fixed' && !$.isIE6;
		this.handle.css('zoom', 1);
		this.range = ini.range;
		this.autoback = ini.autoback !== false;
		if (this.range && (!(this.range instanceof Array) || this.range.length != 4)) {
			throw Error('drag range error!');
		}
		this.oldCursor = this.handle.css('cursor');
		this.dragBorder = ini.dragBorder !== false;
		this.moveEvent = $.proxy(_self.draging, _self);
		this.stopEvent = $.proxy(_self.dragEnd, _self);
		this.handle.bind('mousedown', function(e) {
			var pos;
			pos = _self.layer.offset();
			_self.initData = {
				'x': e.clientX,
				'y': e.clientY,
				'z': _self.layer.css('zIndex'),
				'left': pos.left,
				'top': pos.top
			};
			var z = _self.getZIndex();
			_self.layer.css('zIndex', z);
			_self.handle.css('cursor', 'move');
			$(document).bind('mousemove', _self.moveEvent)
						.bind('losecapture', _self.stopEvent)
						.bind('blur', _self.stopEvent)
						.bind('mouseup', _self.stopEvent);
			_self.handle.each(function (){
				if (this.setCapture) {
					this.setCapture();
				}
			});
			e.stopPropagation();
			e.data = _self.initData;
			_self.ondragstart(e);
		});
	}

	Drag.prototype = {
		ondragstart: $.noop,
		ondraging: $.noop,
		ondragend: $.noop,
		fixRange: function (val, dir){
			var a = Math.max,
				b = Math.min,
				c = this.range;
			if (c instanceof Array){
				return dir == 'x' ? a(c[0], b(val, c[2])):
					a(c[1], b(val, c[3]));
			}else{
				return val;
			}
		},
		getZIndex:  function (){
			return topZ++;
		},
		draging: function(e) {
			if (this.dragBorder && !this.proxy) {
				this.createProxy(this.initData);
			}
			var el = this.proxy || this.layer,
			init = this.initData,
			offset = {
				left: e.clientX - init.x,
				top: e.clientY - init.y
			};
			e.offset = offset;
			this.ondraging(e, el);
			el.css('left', this.fixRange(init.left + offset.left, 'x') + 'px');
			el.css('top', this.fixRange(init.top + offset.top) + 'px');
			this.clearRange();
		},
		clearRange: function() {
			try {
				return window.getSelection ? 
					window.getSelection().removeAllRanges() :
					document.selection.empty();
			} catch(e) {}
		},
		createProxy: function(d) {
			var layer = this.layer.get(0);
			this.proxy = $('<div/>').appendTo(document.body).css({
				position: 'absolute',
				background: 'none',
				zIndex: this.layer.css('zIndex') + 5,
				border: '1px dotted #6A3620',
				width: layer.offsetWidth + 'px',
				height: layer.offsetHeight + 'px',
				left: d.left + 'px',
				top: d.top + 'px'
			});
		},
		dragEnd: function(e) {
			var a, b, pos, client, _self = this;
			if (this.proxy) {
				pos = this.isFixed ? this.proxy[0].getBoundingClientRect() : this.proxy.offset();
				this.layer.css({
					left: pos.left + 'px',
					top: pos.top + 'px'
				});
				this.proxy.each(function (i, el){
					el.parentNode.removeChild(el);
				});
				this.proxy = false;
			}
			pos = this.layer.offset();
			client = $.viewport();
			$(document).unbind('mousemove', this.moveEvent)
						.unbind('losecapture', this.stopEvent)
						.unbind('blur', this.stopEvent)
						.unbind('mouseup', this.stopEvent);
			this.handle.each(function (i, el){
				if (el.releaseCapture) {
					el.releaseCapture();
				}
			});
			this.handle.css('cursor', this.oldCursor);
			this.layer.css('zIndex', this.initData.z);
			a = pos.left < client.left;
			b = pos.top < client.top;
			if (this.autoback && (a || b)) {
				var fx = {};
				if (a) {
					fx.left = this.isFixed ? 0 : client.left;
				}
				if (b) {
					fx.top = this.isFixed ? 0 : client.top;
				}
				this.layer.animate(fx, 200);
			}
			this.ondragend(e);
		}
	};

	$.fn.drag = function (ini){
		ini = Object(ini);
		ini.handle = this;
		return new Drag(ini);
	};


	function Dialog(opts){
		var _self = this;
		this.mask = getMaskLay();
		this.layer = $(opts.layer);
		this.isFixed = this.layer.css('position') == 'fixed' && !$.isIE6;
		if (!this.isFixed) {
			this.layer.css('position', 'absolute');
		}		
		this.content = this.layer.find(opts.content);
		this.buttons = this.layer.find(opts.buttons);
		this.title = this.layer.find(opts.title);
		this._onbtnclick = function (e){
			_self.close(this);
		};
		this._onbtnmousedown = function (e){
			return e.stopPropagation();
		};
		this.buttons.bind('click', this._onbtnclick)
					.bind('mousedown', this._onbtnmousedown);
		if (opts.drag) {
			$(opts.drag).drag({
				layer: opts.layer,
				autoback: opts.autoback
			});
		}
	}

	Dialog.prototype = {
		opacity: 0.5,
		scale: 2.8, 
		onopen: $.noop,
		onclose: $.noop,
		open: function (html, title, opacity){
			var z = this.getZIndex();
			if (title && this.title.size()) {
				this.title.html(title);
			}
			this.layer.css('zIndex', z);
			if (this.content.size()) {
				this.content.html(html);
			}
			if (!isNaN(opacity)) {
				opacity = this.opacity;
			}
			this.mask.css('opacity', opacity);
			this.mask.show(this.layer);
			this.onopen();
			this.center();
		},
		close: function (btn){
			if (!btn || this.onclose(btn) !== false) {
				this.defineHide(this.layer);
				this.mask.hide();
			}
		},
		defineHide: function (layer){
			this.layer.hide();
		},
		defineShow: function (){
			this.layer.show().css('opacity', 1);
		},
		center: function (){
			var client = $.viewport(),
				el = this.layer.get(0);
			if (this.isFixed) {
				client.top = 0;
			}
			this.defineShow();
			this.layer.css({
				left: Math.max(0, (client.width - el.offsetWidth)/2 + client.left) + 'px',
				top: Math.max(0, (client.height - el.offsetHeight)/this.scale + client.top) + 'px'
			});
		},
		getZIndex:  function (){
			return dlgZ++;
		},	
		destroy: function (){
			this.buttons.unbind('click', this._onbtnclick)
				.unbind('mousedown', this._onbtnmousedown);
		}
	};

	$.fn.dialog = function (opts){
		opts = Object(opts);
		opts.layer = this;
		return new Dialog(opts);
	};

})(jQuery);