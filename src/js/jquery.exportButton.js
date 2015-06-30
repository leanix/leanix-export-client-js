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
            this.button.attr('title', '');
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