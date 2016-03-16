ko.bindingHandlers.mitdate = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        // show a picker image after the input (action not implemented yet)
        var observable = valueAccessor();
        var showPickerImage = allBindingsAccessor.get('showPickerImage') || false;
        if (showPickerImage) {
            $(element).after("<i class='icon-date datepicker-image' style='cursor: pointer'></i>");
            $(".datepicker-image").click(function () {
                alert("action not implemented");
            });
        }
        // handler for when the user changes the value in the input
        ko.utils.registerEventHandler(element, 'change', function () {
            var v;
            var value = ko.utils.unwrapObservable(observable);
            if (typeof value === "object") {
                var format = allBindingsAccessor.get('format') || "MM/DD/YYYY";
                v = value.ismit ? value : mit(value);
                var mod = v.minuteOfDay();
                v = mit($(element).val(), format).add(mod, "minutes");
            } else {
                // todo - support more formats?
                // todo - use bootstrap datepicker
                throw "don't know how to interpet '" + value + "'";
            }
            if (observable() === v) {
                observable(v);
                ko.bindingHandlers.mitdate.update(element, valueAccessor, allBindingsAccessor);
            } else {
                observable(v);
            }
        });
        // select the entire input text when it gets focus
        $(element).click(function () {
            $(this).select();
        });
    },
    // when the observable is updated...
    update: function (element, valueAccessor, allBindingsAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        var format = allBindingsAccessor.get('format') || "MM/DD/YYYY";
        if (typeof value === "object") {
            $(element).val(value.format(format));
        } else {
            // todo - support more formats?
            // todo - use bootstrap datepicker
            throw "don't know how to interpet '" + value + "'";
        }
    }
};