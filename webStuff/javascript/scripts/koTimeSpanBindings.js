;var DateTimeBinder = function(strategy) {
    // generic method called to initialize the ko binding applying the specified strategy
    var init = function (element, valueAccessor, allBindingsAccessor) {
        // update the extend strategy with ko accessors
        strategy.allBindingsAccessor = allBindingsAccessor;
        strategy.valueAccessor = valueAccessor;
        element.strategy = strategy;
        // show a picker image after the input (action not implemented yet)
        var showPickerImage = strategy.allBindingsAccessor.get('showPickerImage') || false;
        if (showPickerImage) {
            $(element).after("<i class='" + strategy.css + " " + strategy.icon + "' style='cursor: pointer'></i>");
            $("." + strategy.css).click(function() {
                alert("action not implemented");
            });
        }
        // handler for when the user changes the value in the input
        ko.utils.registerEventHandler(element, 'change', strategy.updateObservable);
        // select the entire input text when it gets focus
        ko.utils.registerEventHandler(element, 'click', function() {
            $(this).select();
        });
    }
    // generic method called to update the element when the vm has changed, applying the specified strategy
    var update = function (element) {
        var value = ko.utils.unwrapObservable(strategy.valueAccessor());
        strategy.updateElement(element, value);
    }
    return {
        init: init,
        update: update,
        owner: this
    }
};

// strategies 
DateTimeBinder.dateDefaultStrategy = {
    css: "datepicker-image'",
    icon: "icon-date",
    defaultFormat: "MM/DD/YYYY",
};
DateTimeBinder.timeDefaultStrategy = {
    css: "timepicker-image'",
    icon: "icon-time",
    defaultFormat: "hh:mm A",
}
DateTimeBinder.durationDefaultStrategy = {
    css: "timepicker-image'",
    icon: "icon-time",
    updateElement: function (element, value) {
        var m = moment.duration(value.minutes, "minutes");
        $(element).val(m.asHours().toFixed(2));
    },
    updateObservable: function (event) {
        var element = event.target;
        var observable = element.strategy.valueAccessor();
        var unwrappedObservable = ko.utils.unwrapObservable(observable) || {};
        if (typeof unwrappedObservable === "object" && unwrappedObservable.isTimeSpan ) {
            var m = moment.duration(Number($(element).val()),"hours");
        } else {
            throw "don't know how to interpet '" + unwrappedObservable + "'";
        }
        if (unwrappedObservable.minutes === m.asMinutes()) {
            ko.bindingHandlers.timespanduration.update(element, element.strategy.valueAccessor, element.strategy.allBindingsAccessor);
        } else {
            unwrappedObservable.minutes = m.asMinutes();
            observable(unwrappedObservable);
        }
    }
}
DateTimeBinder.mitTimeDefaultStrategy = {
    updateElement: function (element, value) {
        var format = element.strategy.allBindingsAccessor.get('format') || element.strategy.defaultFormat;
        $(element).val(value.format(format));
    },
    updateObservable: function (event) {
        var element = event.target;
        var observable = element.strategy.valueAccessor();
        var newMit;
        var unwrappedObservable = ko.utils.unwrapObservable(observable) || {};
        if (typeof unwrappedObservable === "object" ) {
            var oldMit = unwrappedObservable.ismit ? unwrappedObservable : new mit(unwrappedObservable);
            newMit = oldMit.setTime($(element).val());
        } else {
            newMit = new mit(0).startOf("day").setTime($(element).val());
        }
        if (unwrappedObservable.u === newMit.u) {
            ko.bindingHandlers.mittime.update(element, element.strategy.valueAccessor, element.strategy.allBindingsAccessor);
        } else {
            unwrappedObservable.u = newMit.u;
            observable(unwrappedObservable);
        }
    }
}
DateTimeBinder.mitDateDefaultStrategy = {
    updateElement: function (element, value) {
        var format = element.strategy.allBindingsAccessor.get('format') || element.strategy.defaultFormat;
        $(element).val(value.format(format));
    },
    updateObservable: function (event) {
        var element = event.target;
        var observable = element.strategy.valueAccessor();
        var newMit;
        var unwrappedObservable = ko.utils.unwrapObservable(observable) || {};
        if (typeof unwrappedObservable === "object" && unwrappedObservable.ismit) {
            var oldMit = unwrappedObservable;
            var format = element.strategy.allBindingsAccessor.get('format') || element.strategy.defaultFormat;
            newMit = new mit($(element).val(), format).setTime(oldMit.format("hh:mm:ss"));
        } else {
            // todo - support more formats?
            // todo - use bootstrap datepicker2
            throw "don't know how to interpet '" + unwrappedObservable + "'";
        }
        if (unwrappedObservable.u === newMit.u) {
            ko.bindingHandlers.mitdate.update(element, element.strategy.valueAccessor, element.strategy.allBindingsAccessor);
        } else {
            unwrappedObservable.u = newMit.u;
            observable(unwrappedObservable);
        }
    }
}
DateTimeBinder.startDateDefaultStrategy = {
    updateElement: function (element, value) {
        var format = element.strategy.allBindingsAccessor.get('format') || element.strategy.defaultFormat;
        $(element).val(value.start.format(format));
    },
    updateObservable: function (event) {
        var element = event.target;
        var observable = element.strategy.valueAccessor();
        var newMit;
        var unwrappedObservable = ko.utils.unwrapObservable(observable) || {};
        if (typeof unwrappedObservable === "object" && unwrappedObservable.isTimeSpan) {
            var oldMit = unwrappedObservable.start;
            var format = element.strategy.allBindingsAccessor.get('format') || element.strategy.defaultFormat;
            newMit = new mit($(element).val(), format).setTime(oldMit.format("hh:mm:ss"));
        } else {
            // todo - support more formats?
            // todo - use bootstrap datepicker
            throw "don't know how to interpet '" + unwrappedObservable + "'";
        }
        if (unwrappedObservable.start.u === newMit.u) {
            ko.bindingHandlers.timespanstartdate.update(element, element.strategy.valueAccessor, element.strategy.allBindingsAccessor);
        } else {
            unwrappedObservable.start.u = newMit.u;
            observable(unwrappedObservable);
        }
    }
}
DateTimeBinder.startTimeDefaultStrategy = {
    updateElement: function (element, value) {
        var format = element.strategy.allBindingsAccessor.get('format') || element.strategy.defaultFormat;
        $(element).val(value.start.format(format));
    },
    updateObservable: function (event) {
        var element = event.target;
        var observable = element.strategy.valueAccessor();
        var newMit;
        var unwrappedObservable = ko.utils.unwrapObservable(observable) || {};
        if (typeof unwrappedObservable === "object") {
            var oldMit = unwrappedObservable.isTimeSpan ? unwrappedObservable.start : new mit(unwrappedObservable);
            newMit = oldMit.setTime($(element).val());
        } else {
            newMit = new mit(0).startOf("day").setTime($(element).val());
        }
        if (unwrappedObservable.start.u === newMit.u) {
            ko.bindingHandlers.timespanstarttime.update(element, element.strategy.valueAccessor, element.strategy.allBindingsAccessor);
        } else {
            unwrappedObservable.start.u = newMit.u;
            observable(unwrappedObservable);
        }
    }
}
DateTimeBinder.endTimeDefaultStrategy = {
    updateElement: function (element, value) {
        var format = element.strategy.allBindingsAccessor.get('format') || element.strategy.defaultFormat;
        $(element).val(value.end.format(format));
    },
    updateObservable: function (event) {
        var element = event.target;
        var observable = element.strategy.valueAccessor();
        var newMit;
        var unwrappedObservable = ko.utils.unwrapObservable(observable) || {};
        if (typeof unwrappedObservable === "object") {
            var oldMit = unwrappedObservable.isTimeSpan ? unwrappedObservable.end : new mit(unwrappedObservable);
            newMit = oldMit.setTime($(element).val());
        } else {
            newMit = new mit(0).startOf("day").setTime($(element).val());
        }
        if (unwrappedObservable.end.u === newMit.u) {
            ko.bindingHandlers.timespanendtime.update(element, element.strategy.valueAccessor, element.strategy.allBindingsAccessor);
        } else {
            unwrappedObservable.end.u = newMit.u;
            observable(unwrappedObservable);
        }
    }
}
DateTimeBinder.endDateDefaultStrategy = {
    updateElement: function (element, value) {
        var format = element.strategy.allBindingsAccessor.get('format') || element.strategy.defaultFormat;
        $(element).val(value.end.format(format));
    },
    updateObservable: function (event) {
        var element = event.target;
        var observable = element.strategy.valueAccessor();
        var newMit;
        var unwrappedObservable = ko.utils.unwrapObservable(observable) || {};
        if (typeof unwrappedObservable === "object" && unwrappedObservable.isTimeSpan) {
            var oldMit = unwrappedObservable.end;
            var format = element.strategy.allBindingsAccessor.get('format') || element.strategy.defaultFormat;
            newMit = new mit($(element).val(), format).setTime(oldMit.format("hh:mm:ss"));
        } else {
            // todo - support more formats?
            // todo - use bootstrap datepicker
            throw "don't know how to interpet '" + unwrappedObservable + "'";
        }
        if (unwrappedObservable.end.u === newMit.u) {
            ko.bindingHandlers.timespanenddate.update(element, element.strategy.valueAccessor, element.strategy.allBindingsAccessor);
        } else {
            unwrappedObservable.end.u = newMit.u;
            observable(unwrappedObservable);
        }
    }
}

// bindings
ko.bindingHandlers.mitdate = new DateTimeBinder( 
    $.extend(true, { name: "mitdate" }, DateTimeBinder.dateDefaultStrategy, DateTimeBinder.mitDateDefaultStrategy)
);
ko.bindingHandlers.mittime = new DateTimeBinder(
    $.extend(true, { name: "mittime" }, DateTimeBinder.timeDefaultStrategy, DateTimeBinder.mitTimeDefaultStrategy)
);
ko.bindingHandlers.timespanstartdate = new DateTimeBinder (
    $.extend(true, { name: "timespanstartdate" }, DateTimeBinder.dateDefaultStrategy, DateTimeBinder.startDateDefaultStrategy)
);
ko.bindingHandlers.timespanstarttime = new DateTimeBinder(
    $.extend(true, { name: "timespanstarttime" }, DateTimeBinder.timeDefaultStrategy, DateTimeBinder.startTimeDefaultStrategy)
);
ko.bindingHandlers.timespanenddate = new DateTimeBinder (
    $.extend(true, { name: "timespanenddate" }, DateTimeBinder.dateDefaultStrategy, DateTimeBinder.endDateDefaultStrategy)
);
ko.bindingHandlers.timespanendtime = new DateTimeBinder (
    $.extend(true, { name: "timespanendtime" }, DateTimeBinder.timeDefaultStrategy, DateTimeBinder.endTimeDefaultStrategy)
);
ko.bindingHandlers.timespanduration = new DateTimeBinder(
    $.extend(true, { name: "timespanduration" }, DateTimeBinder.durationDefaultStrategy)
);




