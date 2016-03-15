; (function () {
    ko.bindingHandlers.mitDate = {
        defaults: {
            keyMap: {
                '38': { 'change': -1 }, // up arrow
                '37': { 'change': -1 }, // left arrow
                '39': { 'change': 1 },  // right arrow
                '40': { 'change': 1 },  // down arrow
                '33': { 'change': -1, 'unit': 'month' }, // page up
                '34': { 'change': 1, 'unit': 'month' } // page down
            },
            keyPressed: function (oldValue, change, unit, keycode) {
                // default key handler: add requested change and unit
                if (!oldValue.ismit()) {
                    return mit.now(); // default to today
                } else {
                    return mit(oldValue).add(change, unit);
                }
            },
            invalid: '-',
            format: 'MM/DD/YYYY',
            parsePattern: ['M/D/YY', 'M/D/YYYY', 'YYYY-M-D', 'M/D'],
            unit: "day"
        },

        keyMapDataKey: 'mitDate-keymap',

        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            var allBindings = allBindingsAccessor(),
                keyPressed = allBindings.keyPressed || ko.bindingHandlers.mitDate.defaults.keyPressed,
                unitDefault = allBindings.unit || ko.bindingHandlers.mitDate.defaults.unit;

            // get keyMap, add it to the element
            var keyMap = $.extend({}, ko.bindingHandlers.mitDate.defaults.keyMap, allBindings.keyMap || {});
            $(element).data(ko.bindingHandlers.mitDate.keyMapDataKey, keyMap);

            // register change event
            ko.utils.registerEventHandler(element, 'change', function () {

                var observable = valueAccessor();
                var val = $(element).val();

                if ($.isFunction(beforeParse)) {
                    val = beforeParse(val);
                }

                observable(val);

            });

            ko.utils.registerEventHandler(element, 'keydown', function (e) {

                var observable = valueAccessor();

                // get and handle keyMap
                var keyMap = $(element).data(ko.bindingHandlers.mitDate.keyMapDataKey);

                if (keyMap) {
                    if (keyMap.hasOwnProperty(e.which.toString())) {
                        var keyMapping = keyMap[e.which.toString()] || {},
                            change = keyMapping.change || 0,
                            unit = keyMapping.unit || unitDefault || "day";

                        // handle keystroke
                        if (change) {
                            // user-defined date change handler
                            var newValue = observable();

                            if ($.isFunction(keyPressed)) {
                                newValue = keyPressed(observable(), change, unit, e.which);

                                if (newValue.ismit()) {
                                    newValue = newValue.toDate();
                                }
                            };

                            // set updated value
                            if (newValue.ismit()) {
                                observable(newValue);
                            } else {
                                // default to today
                                observable(mit.now());
                            }

                            // select all text and prevent default key action
                            $(element).select();
                            e.preventDefault();
                        }
                    }
                }
            });
        },

        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            var value = valueAccessor(),
                allBindings = allBindingsAccessor(),
                valueUnwrapped = ko.utils.unwrapObservable(value),
                afterParse = allBindings.afterParse || ko.bindingHandlers.mitDate.defaults.afterParse;
            var keyName = $.map(bindingContext.$data, function (v, k) {
                return (k);
            })[0];

            // Date formats: http://dlmitjs.com/docs/#/displaying/format/
            var pattern = allBindings.format || ko.bindingHandlers.mitDate.defaults.format;
            var invalidString = allBindings.invalid == undefined ? ko.bindingHandlers.mitDate.defaults.invalid : allBindings.invalid;
            var parsePattern = allBindings.parsePattern || ko.bindingHandlers.mitDate.defaults.parsePattern;

            var datedlmit =
                valueUnwrapped.ismit() ? mit(valueUnwrapped) :
                    ((valueUnwrapped !== null && valueUnwrapped !== undefined && valueUnwrapped.length > 0) ?
                        mit(valueUnwrapped, parsePattern) :
                        mit.invalid());

            // raise afterParse callback
            if ($.isFunction(afterParse)) {
                var parseValue = afterParse(datedlmit);

                if (parseValue.ismit()) {
                    datedlmit = parseValue;
                } else if (parseValue.ismit()) {
                    datedlmit = mit(parseValue);
                } else if (!parseValue) {
                    datedlmit = mit.invalid();
                }
                // otherwise (e.g., when return true), the parsed datedlmit is not altered
            }

            // get the updated value
            var newValue = datedlmit.isValid() ?
                datedlmit.toDate() : null;


            // format string for input box
            var output = datedlmit.isValid() ?
                datedlmit.format(pattern) :
                invalidString;

            if ($(element).is("input") === true) {
                $(element).val(output);
            } else {
                $(element).text(output);
            }

            // update value
            allBindingsAccessor().mitDate(newValue);
        }
    };
}());
