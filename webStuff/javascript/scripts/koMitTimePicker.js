ko.bindingHandlers.mittimepicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        // show a picker image after the input (action not implemented yet)
        var observable = valueAccessor();
        var showPickerImage = allBindingsAccessor.get('showPickerImage') || false;
        if (showPickerImage) {
            $(element).after("<i class='icon-time timepicker-image' style='cursor: pointer'></i>");
            $(".timepicker-image").click(function () {
                alert("action not implemented");
            });
        }
        // handler for when the user changes the value in the input
        // register change event
        ko.utils.registerEventHandler(element, 'change', function () {
            var v;
            var value = ko.utils.unwrapObservable(observable);
            if (typeof value === "object") {
                v = value.ismit ? value : mit(value);
                v = v.setTime($(element).val());
            } else {
                // assuming tod in minutes
                var m = mit(0).startOf("day").setTime($(element).val());
                v = m.diff(mit(0).startOf("day"), "minutes");
            }
            if (observable() === v) {
                observable(v);
                ko.bindingHandlers.mittimepicker.update(element, valueAccessor, allBindingsAccessor);
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
        var format = allBindingsAccessor.get('format') || "hh:mm A";
        if (typeof value === "object") {
            $(element).val(value.format(format));
        } else {
            // assuming tod in minutes
            var m = mit(0).startOf("day").add(value, "minutes");
            $(element).val(m.format(format));
        }
    }
};
