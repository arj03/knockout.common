// binding for jquery ui datepicker that works with unix date times
ko.bindingHandlers.datepicker = {
    init: function(element, valueAccessor, allBindingsAccessor) {
        //initialize datepicker with some optional options
        var options = allBindingsAccessor().datepickerOptions || {};
        $(element).datepicker(options);
        
        //handle the field changing
        ko.utils.registerEventHandler(element, "change", function() {
            var observable = valueAccessor();
            observable(Math.round($(element).datepicker('getDate')/1000));
        });

        //handle disposal (if KO removes by the template binding)
        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            $(element).datepicker("destroy");
        });
    }
    ,update: function(element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor()),
            current = $(element).datepicker("getDate");

	if (value == 0)
	    return;

        var dateValue = new Date(value*1000);

        if (dateValue - current !== 0) {
            $(element).datepicker("setDate", dateValue);
        }
    }
};

ko.observableArray['fn']["pushArray"] = function(arrayOfValues) {
    this.push.apply(this, arrayOfValues);
}

// paginated view model abstraction
//
// takes a function to be called on next/prev page. This function
// should check if the page id and the page id observable are equal
// when it receives data from the server, to handle request
// reordering.
function paginatedViewModel(requestDataFunc) {
    return new function () {
        var self = this;

        self.elements = ko.observableArray();
        self.nrElements = ko.observable(1);

        // pagination
        self.pageSize = ko.observable(10);
        self.pageIndex = ko.observable(0);
        self.previousPage = function () {
            self.pageIndex(self.pageIndex() - 1);
            requestDataFunc(self.pageIndex(), self.pageSize(), self.pageIndex);
        };
        self.nextPage = function () {
            self.pageIndex(self.pageIndex() + 1);
            requestDataFunc(self.pageIndex(), self.pageSize(), self.pageIndex);
        };
        self.maxPageIndex = ko.computed(function () {
            return Math.ceil(self.nrElements() / self.pageSize()) - 1;
        }, self);

        self.pagedRows = ko.computed(function () {
            var size = self.pageSize();
            var start = self.pageIndex() * size;
            return self.elements.slice(start, start + size);
        }, self);

	self.requestData = function() {
            self.pageIndex(0);
            requestDataFunc(self.pageIndex(), self.pageSize(), self.pageIndex);
	};
    }();
}
