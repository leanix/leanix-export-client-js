jQuery.widget("lx.exportButton", $.lx.exportClient,
{
    button : null,
    result : null,

    _create: function ()
    {
        this._super();

        this.createWidget();
        this.registerListener();
    },

    createWidget : function()
    {
        var el = $(this.element);

        var buttonContainer = $('<div></div>').addClass('export-actions');

        this.button = $('<a></a>').attr('href', '#').addClass('btn btn-primary').html('Save as PDF');
        this.result = $('<div></div>').addClass('export-result');

        buttonContainer.append(this.button);
        el.append(buttonContainer);
        el.append(this.result);
    },

    cleanResult : function()
    {
        this.result.html('');
    },

    showProgress : function()
    {
        this.cleanResult();

        var progress = $('<div></div>').addClass('progress progress-striped active');
        $('<div></div>').addClass('bar').css('width', '100%').appendTo(progress);

        this.result.append(progress);
    },

    showDownload : function(result)
    {
        this.cleanResult();
        var download = $('<a></a>').attr('href', $('#serverUrl').val() + '/' + result.data.relativeUrl).html('Download').addClass('btn btn-primary');
        this.result.append(download);
    },

    registerListener : function()
    {
        var that = this;

        this.button.on('click', function()
        {
            that.showProgress();

            that.export(function(result)
            {
                //that.result.html('Done');
                that.showDownload(result);
                console.log('Finish export');
            });
        });
    }
});