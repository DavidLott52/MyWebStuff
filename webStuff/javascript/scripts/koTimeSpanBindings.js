;datetimebinder = (function(strategy) {
    var self = this;
    self.strategy = strategy;
    // generic method called to initialize the ko binding applying the specified strategy
    self.init = function(element, valueAccessor, allBindingsAccessor) {
        // show a picker image after the input (action not implemented yet)
        var observable = valueAccessor();
        var showPickerImage = allBindingsAccessor.get('showPickerImage') || false;
        if (showPickerImage) {
            $(element).after("<i class='" + self.strategy.css + " " + self.strategy.icon + "' style='cursor: pointer'></i>");
            $("." + self.strategy.css).click(function() {
                alert("action not implemented");
            });
        }
        // handler for when the user changes the value in the input
        ko.utils.registerEventHandler(element, 'change', self.strategy.updateObservable(element, observable, allBindingsAccessor));
        // select the entire input text when it gets focus
        ko.utils.registerEventHandler(element, 'click', function() {
            $(this).select();
        });
    }
    // generic method called to update the element when the vm has changed, applying the specified strategy
    self.update = function (element, valueAccessor, allBindingsAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        value = this.strategy.getValue(value);
        this.strategy.updateElement(element, value);
    }
    return {
        init: self.init,
        update:self.update,
        owner: self
    }
})();


datetimebinder.prototype.updateMitDateFromElement = function (element, observable, allBindingsAccessor) {
    var v;
    var unwrappedObservable = ko.utils.unwrapObservable(observable);
    if (typeof unwrappedObservable === "object") {
        var theMit = strategy.getTheMit ? strategy.getTheMit(unwrappedObservable) : unwrappedObservable;
        var format = allBindingsAccessor.get('format') || strategy.defaultFormat;
        var mod = theMit.minuteOfDay();
        v = mit($(element).val(), format).add(mod, "minutes");
    } else {
        // todo - support more formats?
        // todo - use bootstrap datepicker
        throw "don't know how to interpet '" + unwrappedObservable + "'";
    }
    unwrappedObservable.start = v;
    if (observable().start === v) {
        observable(unwrappedObservable);
        ko.bindingHandlers.mitdatepicker.update(element, valueAccessor, allBindingsAccessor);
    } else {
        observable(unwrappedObservable);
    }
}

datetimebinder.defaultMitTimeStrategy = {
    getTheMit: function (value) { return value; },
    updateObservable: function (element, observable, allBindingsAccessor) {
        var newMit;
        var unwrappedObservable = ko.utils.unwrapObservable(observable);
        if (typeof unwrappedObservable === "object" && unwrappedObservable.hasOwnProperty(ismit)) {
            var oldMit = unwrappedObservable;
            var format = allBindingsAccessor.get('format') || defaultFormat;
            var mod = oldMit.minuteOfDay();
            newMit = mit($(element).val(), format).add(mod, "minutes");
        } else {
            // todo - support more formats?
            // todo - use bootstrap datepicker
            throw "don't know how to interpet '" + unwrappedObservable + "'";
        }
        unwrappedObservable.start = newMit;
        if (observable().start === newMit) {
            observable(unwrappedObservable);
            ko.bindingHandlers.mitdatepicker.update(element, valueAccessor);
        } else {
            observable(unwrappedObservable);
        }
    }
}
datetimebinder.defaultMitDateStrategy = {
    getTheMit: function (value) { return value; },
    updateObservable: function (element, observable, allBindingsAccessor) {
        var newMit;
        var unwrappedObservable = ko.utils.unwrapObservable(observable);
        if (typeof unwrappedObservable === "object") {
            var oldMit = unwrappedObservable;
            var format = allBindingsAccessor.get('format') || defaultFormat;
            var mod = oldMit.minuteOfDay();
            newMit = mit($(element).val(), format).add(mod, "minutes");
        } else {
            // todo - support more formats?
            // todo - use bootstrap datepicker
            throw "don't know how to interpet '" + unwrappedObservable + "'";
        }
        unwrappedObservable.start = newMit;
        if (observable().start === newMit) {
            observable(unwrappedObservable);
            ko.bindingHandlers.mitdatepicker.update(element, valueAccessor);
        } else {
            observable(unwrappedObservable);
        }
    }
}
datetimebinder.defaultStartTimeStrategy = {
    getTheMit: function (value) { return value.start; },
    updateObservable: function (element, observable, allBindingsAccessor) {
        var newMit;
        var unwrappedObservable = ko.utils.unwrapObservable(observable);
        if (typeof unwrappedObservable === "object") {
            var oldMit = unwrappedObservable;
            var format = allBindingsAccessor.get('format') || defaultFormat;
            var mod = oldMit.minuteOfDay();
            newMit = mit($(element).val(), format).add(mod, "minutes");
        } else {
            // todo - support more formats?
            // todo - use bootstrap datepicker
            throw "don't know how to interpet '" + unwrappedObservable + "'";
        }
        unwrappedObservable.start = newMit;
        if (observable().start === newMit) {
            observable(unwrappedObservable);
            ko.bindingHandlers.mitdatepicker.update(element, valueAccessor);
        } else {
            observable(unwrappedObservable);
        }
    }
}

datetimebinder.defaultEndTimeStrategy = {
    getTheMit: function (value) { return value.end; },
    updateObservable: function (element, observable, allBindingsAccessor) {
        var newMit;
        var unwrappedObservable = ko.utils.unwrapObservable(observable);
        if (typeof unwrappedObservable === "object") {
            var oldMit = unwrappedObservable;
            var format = allBindingsAccessor.get('format') || defaultFormat;
            var mod = oldMit.minuteOfDay();
            newMit = mit($(element).val(), format).add(mod, "minutes");
        } else {
            // todo - support more formats?
            // todo - use bootstrap datepicker
            throw "don't know how to interpet '" + unwrappedObservable + "'";
        }
        unwrappedObservable.start = newMit;
        if (observable().start === newMit) {
            observable(unwrappedObservable);
            ko.bindingHandlers.mitdatepicker.update(element, valueAccessor);
        } else {
            observable(unwrappedObservable);
        }
    }
}

datetimebinder.dateDefaultStrategy = {
    css: "datepicker-image'",
    icon: "icon-date",
    defaultFormat: "MM/DD/YYYY",
    getTheMit: function (value) { return value; },
};

datetimebinder.timeDefaultStrategy = {
    css: "timepicker-image'",
    icon: "icon-time",
    defaultFormat: "hh:mm A",
}

ko.bindingHandlers.timespanstartdatepicker = {
    strategy:  $.extend(true,datetimebinder.dateDefaultStrategy, datetimebinder.defaultStartTimeStrategy),
    init: function (element, valueAccessor, allBindingsAccessor) {
        datetimebinder.init(element, valueAccessor, allBindingsAccessor, strategy);
    },
    // when the observable is updated...
    update: function (element, valueAccessor, allBindingsAccessor,) {
        var timespan = ko.utils.unwrapObservable(valueAccessor());
        var format = allBindingsAccessor.get('format') || "MM/DD/YYYY";
        if (typeof timespan === "object") {
            $(element).val(timespan.start.format(format));
        } else {
            // todo - support more formats?
            // todo - use bootstrap datepicker
            throw "don't know how to interpet '" + timespan + "'";
        }
    }
};
ko.bindingHandlers.timespanenddatepicker = {

};