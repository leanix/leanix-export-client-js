/** Copyright LeanIX GmbH 2014 **/

jQuery.widget("lx.exportClient", {
    options: {
        serverUrl: "https://export.leanix.net",
        defaultData : null
    },

    // Internal export client
    exportClient : null,
    defaultData : new ExportData(),

    /**
     * Constructor method
     *
     * @private
     */
    _create: function ()
    {
        this._initialize();
    },

    /**
     * Initializes the widget
     *
     * @private
     */
    _initialize : function()
    {
        this.exportClient = new ExportClient(this.options.serverUrl);
        if (this.options.defaultData)
            this.setDefaultData(this.options.defaultData);
    },

    /**
     * Gets the current defaultData
     * @returns {*}
     */
    getDefaultData : function()
    {
        return this.defaultData;
    },

    /**
     * Set the default export data to be used
     * @param defaultData
     */
    setDefaultData : function(defaultData)
    {
        this.defaultData = defaultData;
    },

    /**
     * Deal with the error resulting from the export
     * @param error
     */
    processError : function(error)
    {
        this._trigger('onError', null, error);
    },

    /**
     * Main method to start the export. onSuccess is called
     * @param onSuccess
     */
    export : function (onSuccess)
    {
        var data = this.getDefaultData();
        var that = this;

        try
        {
            this._trigger('beforeExport', null, data);
            this.exportClient.export(data, function(result)
            {
                that._trigger('onSuccess', null, result);

                if (typeof onSuccess == 'function')
                    onSuccess(result);
            });

        }
        catch (ex)
        {
            this.processError(ex);
        }
    }
});


jQuery.widget("lx.exportButton", $.lx.exportClient,
{
    options : {
        enabled : true,
        labelButton : 'Save as ...',
        cssClassButton : 'btn btn-primary',
        disabledTooltip: 'Please wait until page is loaded.',
        tooltipPlacement: 'bottom'
    },

    button : null,
    result : null,

    _create: function ()
    {
        this._super();

        this.createWidget();
        this.registerListener();

        this.setEnabled(this.options.enabled);
    },

    /**
     * Creates the widget
     */
    createWidget : function()
    {
        var el = $(this.element);

        var buttonContainer = $('<div></div>').addClass('export-actions');

        this.button = $('<a></a>').attr('href', '#').addClass(this.options.cssClassButton).html(this.options.labelButton);
        this.result = $('<div></div>').addClass('export-result');

        buttonContainer.append(this.button);
        el.append(buttonContainer);
        el.append(this.result);
    },

    /**
     * Allows to enable or disabled to button
     *
     * @param enabled
     */
    setEnabled : function(enabled)
    {
        if (typeof enabled == 'undefined')
            enabled = true;

        this.button.attr('data-placement', this.options.tooltipPlacement);

        if (enabled)
        {
            this.button.removeClass('disabled');
            this.button.attr('rel', '');
        }
        else
        {
            this.button.addClass('disabled').attr('rel', 'tooltip').attr('title', this.options.disabledTooltip);
        }
    },

    /**
     * Register event handler
     */
    registerListener : function()
    {
        var that = this;

        this.button.on('click', function()
        {
            if (that.button.hasClass('disabled'))
                return;

            that.showProgress();

            that.export(function(result)
            {
                that.showDownload(result);
            });
        });
    },

    /**
     * Cleans up the result
     */
    cleanResult : function()
    {
        this.result.html('');
    },

    /**
     * Show progress spinner
     */
    showProgress : function()
    {
        this.cleanResult();

        var progress = $('<div></div>').addClass('progress progress-striped active');
        $('<div></div>').addClass('bar').css('width', '100%').appendTo(progress);

        this.result.append(progress);
    },

    /**
     * Show download button
     * @param result
     */
    showDownload : function(result)
    {
        this.cleanResult();
        var download = $('<a></a>').attr('href', this.options.serverUrl + '/' + result.data.relativeUrl).html('Download').addClass('btn btn-primary');
        this.result.append(download);
    },

    /**
     * Process error
     */
    processError : function(error)
    {
        this.cleanResult();
        var alert = $('<span></span>').html(error).addClass('text-error');
        this.result.append(alert);
    }
});
jQuery.widget("lx.exportDialog", $.lx.exportClient,
{
    dialog : null,
    body : null,
    result : null,

    options: {
        dialogTitle : 'Export',
        outputTypes : ['PDF', 'PNG', 'SVG'],
        paperOrientations : [
            {value: 'portrait', label : 'Portrait'},
            {value: 'portrait', label : 'Landscape'}
        ],
        paperFormats : [
            {value: 'a4', label : 'A4'},
            {value: 'a3', label : 'A3'},
            {value: 'a2', label : 'A2'},
            {value: 'a1', label : 'A1'},
            {value: 'a0', label : 'A0'},
            {value: 'letter', label : 'Letter'}
        ],
        defaultPaperOrientation : 'portrait',
        defaultPaperFormat : 'a0'
    },

    _create: function ()
    {
        this._super();
    },

    /**
     * Shows the dialog
     */
    showDialog : function()
    {
        var that = this;

        var buttons = [
            {
            "label" : "Save",
            "class" : "btn-primary",
                "callback": function()
                {
                    that.showProgress();

                    that.getDefaultData().setOutputType(that.getOutputType());

                    if (that.getOutputType() && that.getOutputType().toLowerCase() == 'pdf')
                    {
                        if (that.getPaperOrientation())
                            that.getDefaultData().getPaperSize().setOrientation(that.getPaperOrientation());

                        if (that.getPaperFormat())
                            that.getDefaultData().getPaperSize().setFormat(that.getPaperFormat());
                    }

                    that.export(function(result)
                    {
                        that.showDownload(result);
                    });
                    return false;
                }
            },
            {
            "label" : "Cancel",
            "class" : "btn"
            }
        ];

        this.dialog = bootbox.dialog('loading', buttons, {header: this.options.dialogTitle, animate: false});

        this._createBody();
    },

    setOutputTypes : function(outputTypes)
    {
        this.options.outputTypes = outputTypes;
    },

    setDefaultPaperOptions : function(format, orientation)
    {
        this.options.defaultPaperFormat = format;
        this.options.defaultPaperOrientation = orientation;
    },

    setPaperOrientations : function(orientations)
    {
        this.options.paperOrientations = orientations;
    },

    getPaperOrientation : function()
    {
        var selected = this._getDialogBody().find('#exportPaperOrientation option:selected');

        if (selected.length)
            return selected.val();

        return null;
    },

    getPaperFormat : function()
    {
        var selected = this._getDialogBody().find('#exportPaperFormat option:selected');

        if (selected.length)
            return selected.val();

        return null;
    },

    getOutputType : function()
    {
        var activeTab = this._getDialogBody().find('.tabbable li.active');

        if (activeTab.length)
            return activeTab.first().attr('data-id');

        return null;
    },

    setPaperFormats : function(formats)
    {
        this.options.paperFormats = formats;
    },

    _cleanBody : function()
    {
        this._getDialogBody().html('');
    },

    /**
     * Creates the dialog
     * @private
     */
    _createBody : function()
    {
        this._cleanBody();
        var that = this;

        var tabGroup = $('<div></div>').addClass('tabbable').appendTo(this._getDialogBody());
        var tabsList = $('<ul></ul>').addClass('nav nav-tabs').appendTo(tabGroup);
        var tabContentGroup = $('<div></div>').addClass('tab-content').appendTo(this._getDialogBody());
        this.result = $('<div></div>').addClass('export-result').appendTo(this._getDialogBody());

        for (var i = 0; i < this.options.outputTypes.length; i++)
        {
            var isActive = i == 0;
            var tab = this.options.outputTypes[i];

            var item = $('<li></li>').appendTo(tabsList).attr('data-id', tab);


            var tabLink = $('<a></a>').attr('href','#tab_' + tab).html(tab).attr('data-toggle', 'tab').appendTo(item);

            var tabContent = this._renderTab(tab);

            if (isActive)
            {
                item.addClass('active');
                tabContent.addClass('active');
            }

            tabLink.on('click', function(event)
            {
                that._cleanResult();
            });

            tabContentGroup.append(tabContent);
        }


    },

    _cleanResult : function()
    {
        this.result.html('');
    },

    _renderTab : function(outputType)
    {
        var tab = $('<div></div>').addClass('tab-pane');
        tab.attr('id', 'tab_' + outputType);

        switch (outputType.toLowerCase())
        {
            case 'pdf':
                this._renderSelect('Format', 'exportPaperFormat', this.options.paperFormats, this.options.defaultPaperFormat).appendTo(tab);
                this._renderSelect('Orientation', 'exportPaperOrientation', this.options.paperOrientations, this.options.defaultPaperOrientation).appendTo(tab);
                break;
            case 'png':
                tab.html('Click below to generate a PNG bitmap image from the data.');
                break;
            case 'svg':
                tab.html('Click below to generate a SVG vector image from the data.');
                break;
        }

        return tab;
    },

    _renderSelect : function(label, id, items, selected)
    {
        var controlGroup = $('<div></div>').addClass('control-group');

        $('<label></label>').html(label).appendTo(controlGroup);

        var select = $('<select></select>').attr('id', id).appendTo(controlGroup);

        for (var i = 0; i < items.length; i++)
        {
            var option = $('<option></option>').attr('value', items[i].value).html(items[i].label).appendTo(select);

            if (items[i].active || selected.toLowerCase() == items[i].value.toLowerCase())
                option.attr('selected', 'selected');
        }


        var that = this;
        select.on('change', function() {
            that._cleanResult();
        });

        return controlGroup;
    },

    /**
     * Returns the dialog body
     * @returns {*}
     * @private
     */
    _getDialogBody : function()
    {
        return this.dialog.find('.modal-body');
    },

    /**
     * Show download button
     * @param result
     */
    showDownload : function(result)
    {
        this._cleanResult();
        var download = $('<a></a>').attr('href', this.options.serverUrl + '/' + result.data.relativeUrl).html('Download').addClass('btn btn-primary');
        this.result.append(download);
    },

    /**
     * Process error
     */
    processError : function(error)
    {
        var alert = $('<div></div>').html(error).addClass('alert alert-error');
        this.result.append(alert);
    },

    /**
     * Show progress spinner
     */
    showProgress : function()
    {
        this._cleanResult();

        var progress = $('<div></div>').addClass('progress progress-striped active');
        $('<div></div>').addClass('bar').css('width', '100%').appendTo(progress);

        this.result.append(progress);
    }
});