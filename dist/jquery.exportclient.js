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
     * Main method to start the export. onSuccess is called
     * @param onSuccess
     */
    export : function (onSuccess)
    {
        var data = this.getDefaultData();

        this._trigger('beforeExport', null, data);

        this.exportClient.export(data, onSuccess);
    }
});

