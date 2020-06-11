$.fn.genTimer = function(options) {
    var defaults = {
        beginTime: (new Date()),
        unitWord: {
            hours: ":",
            minutes: ":",
            seconds: ""
        },
        callbackOnlyDatas: false
    };
    var DAY_MILLISECOND = 1000 * 60 * 60 * 24;
    var opts = $.extend({},
    defaults, options);
    var _this = this;
    var day_label = "D";
    var days_label = "D";
    var callback = function() {
        if (duration < 0) {
            opts.callback.call(_this, opts.callbackOnlyDatas ? {
                hours: '00',
                minutes: '00',
                seconds: '00',
                dates: 0
            }: "00" + opts.unitWord.hours + "00" + opts.unitWord.minutes + "00");
            clearInterval(_this.interval)
        } else {
            var viewDuration = calcView(duration);
            if (opts.callbackOnlyDatas) {
                opts.callback.call(_this, viewDuration)
            } else {
                if (duration >= DAY_MILLISECOND * 2) {
                    opts.callback.call(_this, '<span class="day_count">' + viewDuration.dates + '</span><span class="day">' + days_label + '</span> <span class="day_seconds">' + viewDuration.hours + opts.unitWord.hours + viewDuration.minutes + opts.unitWord.minutes + viewDuration.seconds + opts.unitWord.seconds + '</span>')
                } else if (duration >= DAY_MILLISECOND) {
                    opts.callback.call(_this, '<span class="day_count">' + viewDuration.dates + '</span><span class="day">' + day_label + '</span> <span class="day_seconds">' + viewDuration.hours + opts.unitWord.hours + viewDuration.minutes + opts.unitWord.minutes + viewDuration.seconds + opts.unitWord.seconds + '</span>')
                } else {
                    opts.callback.call(_this, '<span class="seconds">' + viewDuration.hours + opts.unitWord.hours + viewDuration.minutes + opts.unitWord.minutes + viewDuration.seconds + opts.unitWord.seconds + '</span>')
                }
            }
        }
        duration -= 1000
    };
    _this.interval = setInterval(callback, 1000);
    opts.targetTime = opts.targetTime.replace(/\-/g, "/");
    opts.beginTime = opts.beginTime.replace(/\-/g, "/");
    var duration = new Date(opts.targetTime) - new Date(opts.beginTime);
    callback();
    function calcView(duration) {
        var dates = Math.floor(duration / DAY_MILLISECOND);
        var hours = Math.floor((duration - dates * DAY_MILLISECOND) / (1000 * 60 * 60));
        var minutes = Math.floor((duration - dates * DAY_MILLISECOND - hours * 1000 * 60 * 60) / (1000 * 60));
        var seconds = Math.floor((duration - dates * DAY_MILLISECOND - hours * 1000 * 60 * 60 - minutes * 1000 * 60) / 1000);
        return {
            hours: ('0' + hours).slice( - 2),
            minutes: ('0' + minutes).slice( - 2),
            seconds: ('0' + seconds).slice( - 2),
            dates: dates
        }
    }
};