Knockout common
===============

This is a collection of functions that I find useful when writing knockout code.

Currently two functions are available:

Datepicker
----------

Enables easier binding between knockout observables and jQuery UIs
datepicker. It works on unix timestamp instead of datetime javascript
objects, as that fits better with JSON.

Example:

    <input data-bind="datepicker: myDate, datepickerOptions: {firstDay: 1, dateFormat: 'dd/mm/yy'}" />

Paginated view model
--------------------

A simple view model that abstracts the knockout code of pagination.

    function requestExportData(curPageIndex, pageSize, curPageIndexObservable) {
        callbackUrl("Default.aspx", "GetExportedDataFromServer", $.toJSON({ pageIndex: curPageIndex, pageSize: pageSize, type: type }),
                    function (d) {
    		        // remember to check if the request is still current
    		        if (curPageIndex != curPageIndexObservable())
    			    return;
    
                        var data = $.parseJSON(d.d);
                        exportedViewModel.nrElements(data.nrRows);
                        ko.wrap.fromJS(exportedViewModel.elements, data.rows);
                    }, function () { showMessage("failed to get exported data files"); });
    }
    
    var exportedViewModel = paginatedViewModel(requestExportData);
    
    ko.applyBindings(exportedViewModel, $("#exportedDiv")[0]);
    exportedViewModel.requestData();

Example HTML code:

    <div id="exportedDiv">
        <h3>Last export data files</h3>

        <table class="simple">
            <tr>
                <th>Time</th>
                <th>File</th>
            </tr>
            <tbody data-bind="foreach: elements">
                <tr>
                    <td data-bind="text: datetime"></td>
                    <td><a data-bind="attr: { href: href, title: filename }"><div data-bind="text: filename"></div></a></td>
                </tr>
            </tbody>
        </table>

        <div>
            <span style="min-width: 145px; min-height: 14px; display:inline-block; float: left;"><input type="button" style="margin-right: 5px;" class="btn" data-bind="click: exportedViewModel.previousPage, visible: exportedViewModel.pageIndex() > 0" value="Previous page" /></span>
            <input type="button" class="btn" data-bind="click: exportedViewModel.nextPage, visible: exportedViewModel.pageIndex() < exportedViewModel.maxPageIndex()" value="Next page" />
        </div>

        <div style="clear: both"><br /></div>
    </div>
