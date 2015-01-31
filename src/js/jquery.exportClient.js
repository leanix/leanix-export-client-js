
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
            var hasLogger = !!(window.console && window.console.log);
            if (hasLogger)
                console.log(ex);

            this.processError(ex);
        }
    }
});

