
jQuery.widget("lx.exportclient", {
    options: {
        serverUrl: "https://export.leanix.net",
        defaultData : null
    },

    // Internal export client
    exportClient : null,
    getData : function(defaultData) {},
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
     * Called before the export takes place. Allows to register a callback to modify the export data
     * @param getData
     */
    onGetData : function (getData)
    {
        this.getData = getData;
    },

    /**
     * Main method to start the export. onSuccess is called
     * @param onSuccess
     */
    export : function (onSuccess)
    {
        var exportData = this.getData(this.getDefaultData());

        this.exportClient.export(exportData, onSuccess);
    }
});

