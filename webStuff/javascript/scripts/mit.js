// mit "Moment in Time"
// using moment.js for basic calculations
/*
    The intent of this module is to simplify the use of time and time zones.
    Moment alone does not handle time zones.
    Moment-Time Zone adds some functionality but it can be confusing.
    This is an effort to bring those together for our purposes.
    -   Moment uses a different set of time zone IDs from .Net
        mit adds the common .net time zone IDs.

    IMPORTANT:
        mit.setTimezone() should be the FIRST call anytime data is loaded (with a different time zone)
    
        mit provides many of the manipulation features of moment. The difference is that the argument 
        is NOT changed. An new mit is returned representing the result.

        All times passed into timecard (etc) javascript should be in the time zone specified
        with the data.
*/
; (function () {
    // Moment is not guaranteed to have the correct time zone as default,
    // because we need to clear the default in some scenarios to avoid
    // adverse side effects. This acts as a backup in case the default is unset.
    var defaultZone; // private

    // create a new mit from:
    //      - another mit
    //      - a number representing the binary value of the time
    //      - a string that will be parsed based on the 'format'
    window.mit = function (input, format) {
        if (!input) {
            return _makeMit(0);
        }
        if (input.hasOwnProperty('ismit')) {
            // format is not needed
            return $.extend(true, {}, input);
        }
        if (typeof input === "number") {
            // format is not needed
            return _makeMit(input);
        }
        var zone = mit.getDefaultTimeZone();
        var u;
        if (typeof input === 'string') {
            if (zone) {
                // see moment.js 'format' documentation
                u = moment.tz(input, format, zone.name).valueOf();
                return _makeMit(u);
            }
        }
        if (input instanceof Date) {
            if (zone) {
                var inputAsString = (input.getMonth() + 1) + "/" + input.getDate() + "/" + input.getFullYear();
                // see moment.js 'format' documentation
                u = moment.tz(inputAsString, format, zone.name).valueOf();
                return _makeMit(u);
            }
        }
        console.error('Unable to determine default timezone! It must be set manually!');
        return NaN;
    }
    this._add = function (v, unit) {
        if (!unit) {
            v += this.u;
            return mit(v);
        }
        var u = moment(this.u).add(v, unit).valueOf();
        var result = _makeMit(u);
        if (unit === "days" || unit === "day") {
            var diff = this.hour() - result.hour();
            result.add(diff, "hours");
        }
        return result;
    }
    this._makeMit = function (u) {
        return {
            u: u,
            t: moment(u).format(),
            ismit: true,
            add: _add,
            format: _format,
            hour: _hour,
            maxHours: 24,
            minute: _minute,
            minuteOfDay: _minuteOfDay,
            day: _day,   // 0 === sunday
            date: _date, // day of month
            week: _week,
            month: _month,
            diff: _diff,
            startOf: _startOf,
            endOf: _endOf,
            isDST: _isDst,
            isSame: _isSame,
            equals: _isSame,
            isBefore: _isBefore,
            isAfter: _isAfter,
            momentObj: _moment,
            setTime: _setTime
        }
    }
    this._isAfter = function (c) {
        return c != undefined ? this.u > c.u : false;
    }
    this._isBefore = function (c) {
        return c != undefined ? this.u < c.u : false;
    }
    this._moment = function() {
        return moment(this.u);
    }
    this._format = function (format) {
        return moment(this.u).format(format);
    }
    this._hour = function () {
        return moment(this.u).hour();
    }
    this._minute = function () {
        return moment(this.u).minute();
    }
    this._minuteOfDay = function() {
        return this.diff(this.startOf("day"), "minutes");
    }
    this._day = function () {
        return moment(this.u).day();
    }
    this._date = function () {
        return moment(this.u).date();
    }
    this._week = function () {
        return moment(this.u).week();
    }
    this._month = function () {
        return moment(this.u).month();
    }
    this._isDst = function () {
        return moment(this.u).isDST();
    }
    this._isSame = function(c) {
        return c != undefined ? this.u === c.u : false;
    }
    this._startOf = function (x) {
        return _makeMit(moment(this.u).startOf(x).valueOf());
    }
    this._endOf = function (x) {
        return _makeMit(moment(this.u).endOf(x).valueOf());
    }
    this._diff = function (m, units, asFloat) {
        if (m!=undefined && m.u != null && this.u != null) {
            return moment(this.u).diff(moment(m.u), units, asFloat);
        } else {
            return 0;
        }
    }
    // _setTime is based on  Timepicker Component for Twitter Bootstrap
    // Copyright 2013 Joris de Wit and bootstrap-timepicker contributors
    this._setTime = function (time) {
        if (!time) {
            return mit(this);
        }

        var timeMode,
            timeArray,
            hour,
            minute,
            second,
            meridian;
        if (time.ismit) {
            mit(time);
        }
        else if (typeof time === 'object' && time.getMonth) {
            // this is a date object
            hour = time.getHours();
            minute = time.getMinutes();
            second = time.getSeconds();

            if (this.showMeridian) {
                meridian = 'AM';
                if (hour > 12) {
                    meridian = 'PM';
                    hour = hour % 12;
                }

                if (hour === 12) {
                    meridian = 'PM';
                }
            }
            return mit(time);
        } else {
            timeMode = ((/a/i).test(time) ? 1 : 0) + ((/p/i).test(time) ? 2 : 0); // 0 = none, 1 = AM, 2 = PM, 3 = BOTH.
            if (timeMode > 2) { // If both are present, fail.
                return mit(this);
            } else {
                timeArray = time.replace(/[^0-9\:]/g, '').split(':');

                hour = timeArray[0] ? timeArray[0].toString() : timeArray.toString();

                if (this.explicitMode && hour.length > 2 && (hour.length % 2) !== 0) {
                    return mit(this);
                }

                minute = timeArray[1] ? timeArray[1].toString() : '';
                second = timeArray[2] ? timeArray[2].toString() : '';

                // adaptive time parsing
                if (hour.length > 4) {
                    second = hour.slice(-2);
                    hour = hour.slice(0, -2);
                }

                if (hour.length > 2) {
                    minute = hour.slice(-2);
                    hour = hour.slice(0, -2);
                }

                if (minute.length > 2) {
                    second = minute.slice(-2);
                    minute = minute.slice(0, -2);
                }

                hour = parseInt(hour, 10);
                minute = parseInt(minute, 10);
                second = parseInt(second, 10);

                if (isNaN(hour)) {
                    hour = 0;
                }
                if (isNaN(minute)) {
                    minute = 0;
                }
                if (isNaN(second)) {
                    second = 0;
                }

                // Adjust the time based upon unit boundary.
                // NOTE: Negatives will never occur due to time.replace() above.
                if (second > 59) {
                    second = 59;
                }

                if (minute > 59) {
                    minute = 59;
                }

                if (hour >= this.maxHours) {
                    // No day/date handling.
                    hour = 0;
                }

                if (this.showMeridian) {
                    if (hour > 12) {
                        // Force PM.
                        timeMode = 2;
                        hour -= 12;
                    }
                    if (!timeMode) {
                        timeMode = 1;
                    }
                    if (hour === 0) {
                        hour = 12; // AM or PM, reset to 12.  0 AM = 12 AM.  0 PM = 12 PM, etc.
                    }
                    meridian = timeMode === 1 ? 'AM' : 'PM';
                } else if (hour < 12 && timeMode === 2) {
                    hour += 12;
                } else {
                    if (hour >= this.maxHours) {
                        hour = 0;
                    } else if ((hour < 0) || (hour === 12 && timeMode === 1)) {
                        hour = 0;
                    }
                }
            }
            var x = mit(this).startOf("day").add(hour, "hours").add(minute, "minutes").add(second, "seconds");
            return x;
        }
        return mit(this);
    };

    // Gets the overall default time zone
    mit.getDefaultTimeZone = function() {
        return moment.defaultZone || defaultZone;
    }
    // Return a new mit representing the current (browser) time in the time zone 
    // specified by the call to mit.setTimezone
    mit.now = function () {
        var u = moment().utc().valueOf();
        return _makeMit(u);
    }
    // specify the time zone in use
    // this should be called first!
    mit.setTimezone = function (zone) {
        moment.tz.setDefault(zone);
        defaultZone = moment.defaultZone;
    }

    // this needs to be called whenever you leave a page that uses the above
    // setTimezone() function (or moment.tz.setDefault(), of course)
    mit.clearTimezoneDefault = function() {
        moment.tz.setDefault();
    }

    // add common .net time zones
    if (!moment.tz.zone ('Pacific Standard Time')) {
        moment.tz.link([
"Africa/Bangui|W. Central Africa Standard Time",
"Africa/Cairo|Egypt Standard Time",
"Africa/Casablanca|Morocco Standard Time",
"Africa/Harare|South Africa Standard Time",
"Africa/Johannesburg|South Africa Standard Time",
"Africa/Lagos|W. Central Africa Standard Time",
"Africa/Monrovia|Greenwich Standard Time",
"Africa/Nairobi|E. Africa Standard Time",
"Africa/Windhoek|Namibia Standard Time",
"America/Anchorage|Alaskan Standard Time",
"America/Argentina/San_Juan|Argentina Standard Time",
"America/Asuncion|Paraguay Standard Time",
"America/Bahia|Bahia Standard Time",
"America/Bogota|SA Pacific Standard Time",
"America/Buenos_Aires|Argentina Standard Time",
"America/Caracas|Venezuela Standard Time",
"America/Cayenne|SA Eastern Standard Time",
"America/Chicago|Central Standard Time",
"America/Chihuahua|Mountain Standard Time (Mexico)",
"America/Cuiaba|Central Brazilian Standard Time",
"America/Denver|Mountain Standard Time",
"America/Fortaleza|SA Eastern Standard Time",
"America/Godthab|Greenland Standard Time",
"America/Guatemala|Central America Standard Time",
"America/Halifax|Atlantic Standard Time",
"America/Indianapolis|US Eastern Standard Time",
"America/La_Paz|SA Western Standard Time",
"America/Los_Angeles|Pacific Standard Time",
"America/Mexico_City|Mexico Standard Time",
"America/Montevideo|Montevideo Standard Time",
"America/New_York|Eastern Standard Time",
"America/Noronha|UTC-02",
"America/Phoenix|US Mountain Standard Time",
"America/Regina|Canada Central Standard Time",
"America/Santa_Isabel|Pacific Standard Time (Mexico)",
"America/Santiago|Pacific SA Standard Time",
"America/Sao_Paulo|E. South America Standard Time",
"America/St_Johns|Newfoundland Standard Time",
"America/Tijuana|Pacific Standard Time",
"Antarctica/McMurdo|New Zealand Standard Time",
"Atlantic/South_Georgia|UTC-02",
"Asia/Almaty|Central Asia Standard Time",
"Asia/Amman|Jordan Standard Time",
"Asia/Baghdad|Arabic Standard Time",
"Asia/Baku|Azerbaijan Standard Time",
"Asia/Bangkok|SE Asia Standard Time",
"Asia/Beirut|Middle East Standard Time",
"Asia/Calcutta|India Standard Time",
"Asia/Colombo|Sri Lanka Standard Time",
"Asia/Damascus|Syria Standard Time",
"Asia/Dhaka|Bangladesh Standard Time",
"Asia/Dubai|Arabian Standard Time",
"Asia/Irkutsk|North Asia East Standard Time",
"Asia/Jerusalem|Israel Standard Time",
"Asia/Kabul|Afghanistan Standard Time",
"Asia/Kamchatka|Kamchatka Standard Time",
"Asia/Karachi|Pakistan Standard Time",
"Asia/Katmandu|Nepal Standard Time",
"Asia/Kolkata|India Standard Time",
"Asia/Krasnoyarsk|North Asia Standard Time",
"Asia/Kuala_Lumpur|Singapore Standard Time",
"Asia/Kuwait|Arab Standard Time",
"Asia/Magadan|Magadan Standard Time",
"Asia/Muscat|Arabian Standard Time",
"Asia/Novosibirsk|N. Central Asia Standard Time",
"Asia/Oral|West Asia Standard Time",
"Asia/Rangoon|Myanmar Standard Time",
"Asia/Riyadh|Arab Standard Time",
"Asia/Seoul|Korea Standard Time",
"Asia/Shanghai|China Standard Time",
"Asia/Singapore|Singapore Standard Time",
"Asia/Taipei|Taipei Standard Time",
"Asia/Tashkent|West Asia Standard Time",
"Asia/Tbilisi|Georgian Standard Time",
"Asia/Tehran|Iran Standard Time",
"Asia/Tokyo|Tokyo Standard Time",
"Asia/Ulaanbaatar|Ulaanbaatar Standard Time",
"Asia/Vladivostok|Vladivostok Standard Time",
"Asia/Yakutsk|Yakutsk Standard Time",
"Asia/Yekaterinburg|Ekaterinburg Standard Time",
"Asia/Yerevan|Armenian Standard Time",
"Atlantic/Azores|Azores Standard Time",
"Atlantic/Cape_Verde|Cape Verde Standard Time",
"Atlantic/Reykjavik|Greenwich Standard Time",
"Australia/Adelaide|Cen. Australia Standard Time",
"Australia/Brisbane|E. Australia Standard Time",
"Australia/Darwin|AUS Central Standard Time",
"Australia/Hobart|Tasmania Standard Time",
"Australia/Perth|W. Australia Standard Time",
"Australia/Sydney|AUS Eastern Standard Time",
"Etc/GMT|UTC",
"Etc/GMT+11|UTC-11",
"Etc/GMT+12|Dateline Standard Time",
"Etc/GMT+2|UTC-02",
"Etc/GMT-12|UTC+12",
"Europe/Amsterdam|W. Europe Standard Time",
"Europe/Athens|GTB Standard Time",
"Europe/Belgrade|Central Europe Standard Time",
"Europe/Berlin|W. Europe Standard Time",
"Europe/Brussels|Romance Standard Time",
"Europe/Budapest|Central Europe Standard Time",
"Europe/Dublin|GMT Standard Time",
"Europe/Helsinki|FLE Standard Time",
"Europe/Istanbul|GTB Standard Time",
"Europe/Kiev|FLE Standard Time",
"Europe/London|GMT Standard Time",
"Europe/Minsk|E. Europe Standard Time",
"Europe/Moscow|Russian Standard Time",
"Europe/Paris|Romance Standard Time",
"Europe/Sarajevo|Central European Standard Time",
"Europe/Warsaw|Central European Standard Time",
"Indian/Mauritius|Mauritius Standard Time",
"Pacific/Apia|Samoa Standard Time",
"Pacific/Auckland|New Zealand Standard Time",
"Pacific/Fiji|Fiji Standard Time",
"Pacific/Guadalcanal|Central Pacific Standard Time",
"Pacific/Guam|West Pacific Standard Time",
"Pacific/Honolulu|Hawaiian Standard Time",
"Pacific/Pago_Pago|UTC-11",
"Pacific/Port_Moresby|West Pacific Standard Time",
"Pacific/Tongatapu|Tonga Standard Time"
        ]);
    }

})();
