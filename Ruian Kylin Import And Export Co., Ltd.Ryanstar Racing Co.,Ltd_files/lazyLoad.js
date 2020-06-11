/*
1、调用方式
new LazyLoad(占位图[, rel的属性名]);
2、如果第二个参数存在， 则只访问 rel = 最二个参数的图片
*/
function LazyLoad(empty_img, attr){
	var nu = navigator.userAgent;
	if (!/chrome|firefox/i.test(nu)) {
		this.index(empty_img, attr);
	}    
}
LazyLoad.prototype={
    index:function (empty_img, rel){
        var images = document.images, list=[], sys=this;
        var dr=this.getRect();
        for (var i = images.length; i--;) {
            var o = images[i], or=this.getRect(o);
            if (o.getAttribute('rel') == rel || or.top<dr.bottom ||this.isIntersect(dr, or)) {continue}
            o.setAttribute('rel',o.src);
            o.src= "/res/front/default/statics/images/grey.gif" ? "/res/front/default/statics/images/grey.gif" : 'about:blank';
            list.push(o);
        }
        this.list=list;
        if (list.length>0) {
			function checkAndLoad(){
                if(list.length==0){return}
                clearTimeout(sys.lazyTimer);
                sys.lazyTimer=setTimeout(function() {
                    sys.loadImg()
                },200)
            }
			checkAndLoad();
            this.on(window,'scroll', checkAndLoad);
            this.on(window,'resize', checkAndLoad);
        }
    },
    get:function (el){
        return typeof el=="string" ? document.getElementById(el) : el;
    },
    on: function(el, type, fn) {
        el.attachEvent ? el.attachEvent('on' + type,function() {
            fn.call(el, event)
        }) : el.addEventListener(type, fn, false);
    },
    loadImg:function (){
        var list=this.list, noload=[], dr=this.getRect(), S = this;
        for (var i =  list.length; i--;) {
            var o=list[i];
            if (this.isIntersect(dr, this.getRect(o))) {
                o.onload = function (){
                    S.fadeIn(this);
					this.style.visibility='visible';
                }
                o.src=o.getAttribute('rel');
                continue;
            }
            noload.push(o)
        }
        this.list=noload
    },
    isIntersect:function (r1, r2){
         return !(r1.right<r2.left||r1.top>r2.bottom||r1.left>r2.right||r1.bottom<r2.top)
    },
    getRect:function (el){
        if (el) {
            var el=this.get(el), t=el, x=0, y=0;
            do{
                x+=t.offsetLeft;
                y+=t.offsetTop                
            }while(t=t.offsetParent)
            return {left:x, top:y, right:x+el.offsetWidth,bottom:y+el.offsetHeight}
        }else{
            var d = document, dd = d.documentElement, db = d.body, M = Math.max;    
            var doc = d.compatMode == "CSS1Compat" ? dd: db;
			var pd = 20;
            var x=M(dd.scrollLeft, db.scrollLeft),y=M(dd.scrollTop, db.scrollTop);
            return {left:x,top:y,right:x+doc.clientWidth+pd,bottom:y+doc.clientHeight+pd}
        }
    },
    fade: function (el,val) {
        var s=el.style;
        s.zoom=1;
        s.filter="alpha(opacity="+parseInt(val*100)+")";
        s.opacity=val;
    },
    fx:function (f,t,a,b,c){
        var D=Date,d=+new D,e, a=a || D, b=b || D, c=c || D;
        if(a()===false)return;
        var tw=function(x) {return (x /= 0.5) < 1 ? (0.5 * Math.pow(x, 2)) : (-0.5 * ((x -= 2) * x - 2))};
        return e=setInterval(function (){
            var z=Math.min(1,(new D-d)/480);
            if(false===b(+f+(t-f)*tw(z),z) || z==1)c(clearTimeout(e))
        },10)
    },
    fadeIn: function (img){
        var host = this;
        img.style.background = '#fff';
        this.fx(0,1,function (){
            host.fade(img,0);
        },function (x){
            host.fade(img,x)
        }, function (){
            img.style.background = '#fff';
        })
    }
};
    
   