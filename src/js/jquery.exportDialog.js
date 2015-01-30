jQuery.widget("lx.exportDialog", $.lx.exportClient,
{
    dialog : null,
    body : null,

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
                "callback": function() {
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

        this.dialog = bootbox.dialog('loading', buttons, {header: 'Save as PDF', animate: false});
    },

    /**
     * Gets the body element of the dialog
     * @returns {*}
     */
    getDialogBody : function()
    {
        return this.dialog.find('.modal-body');
    },

    /**
     * Show download button
     * @param result
     */
    showDownload : function(result)
    {
        //this.cleanResult();
        var download = $('<a></a>').attr('href', this.options.serverUrl + '/' + result.data.relativeUrl).html('Download').addClass('btn btn-primary');
        this.getDialogBody().append(download);
    }
});