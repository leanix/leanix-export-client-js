
jQuery.widget("lx.exportclient", {
    options: {
        serverUrl: "https://export.leanix.net"
    },

    _create: function ()
    {
        this.exportClient = new ExportClient(this.options.serverUrl);
    },

    export : function (exportData)
    {
        this.exportClient.export(exportData);
    }
});

