; (function () {
    window.timespan = function(start,end,lockEnd) {
        if (!start.hasOwnProperty('ismit') || !end.hasOwnProperty('ismit')) {
            throw("start and end must be mit objects.");
        }
        var _start = start;
        var _end = end;
        var _lockEnd = lockEnd === undefined ? false : true;
        return {
            get start() { return _start; },
            set start(value) {
                if (!value.hasOwnProperty('ismit')) {
                    throw ("start must be an mit object.");
                }
                _start = value;
            },
            get end() { return _end; },
            set end(value) {
                if (!value.hasOwnProperty('ismit') ) {
                    throw("end must be an mit object.");
                }
                _end = value;
            },
            get minutes() {
                return _end.diff(_start, "minutes");
            },
            set minutes(value) {
                if (_lockEnd) {
                    _start = _end.add(-value, "minutes");
                } else {
                    _end = _start.add(value, "minutes");
                }
            }
        };
    }
})();