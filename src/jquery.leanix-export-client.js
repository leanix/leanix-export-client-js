/**
 * leanix-export-client
 * ====================
 *
 */
jQuery.widget("lx.exportclient", {
    options: {
        exportServer: null,
        name: "export",
        inputType: "HTML",
        outputType: null,
        dataSelector: null,
        paperSize: null,
        header: null,
        footer: null,
        viewportSize: null,
        zoomFactor: 1,
        autoScale: null,
        getStyles: null
    },
    
    /**
     * Factory method.
     * 
     * 
     * 
     */
    _create: function ()
    {
        if (this.options.exportServer === null)
            throw "The exportServer url must be set.";

        if (typeof this.options.dataSelector !== "function")
            throw "The dataSelector option must be a function.";

        if (this.options.outputType === null)
        {
            this.outputType = $(
                "<select><option value='pdf'>PDF</option><option value='PNG'>PNG</option><option value='JPG'>JPG</option></select>",
                { class: 'class="form-control"', id: 'outputType'}
            ).appendTo(this.element);
            this.options.outputType = function(){return $(this.outputType).val();};
        }

        if (this.options.paperSize === null)
        {
            this.paperSize = $(
                "<select><option value='A4.portrait'>A4 portrait</option><option value='A4.landscape'>A4 landscape</option><option value='A3.portrait'>A3 portrait</option><option value='A3.landscape'>A3 landscape</option><option value='letter.portrait'>Letter portrait</option><option value='letter.landscape'>Letter landscape</option></select>",
                { class: 'class="form-control"', id: 'inputType'}
            ).appendTo(this.element);

            this.options.paperSize = function()
            {
                var format = $(this.paperSize).val().split('.')[0];
                var orientation = $(this.paperSize).val().split('.')[1];
                return {
                    format: format,
                    orientation: orientation,
                    margin: "1cm"
                };
            };
        }

        this.exportResult = $("<div></div>", {
            id: "export-result"
        }).appendTo(this.element).button();
    },

    /**
     * Reads all css rules.
     * 
     * @returns {String}
     */
    getStyles: function ()
    {
        var buffer = "";
        for (var i = 0; i < document.styleSheets.length; i++)
        {
            if (document.styleSheets[i].cssRules == null)
                continue;
            for (var j = 0; j < document.styleSheets[i].cssRules.length; j++)
            {
                buffer += document.styleSheets[i].cssRules[j].cssText;
            }
        }

        return buffer;
    },
    
    /**
     * Creates a phantomjs papersize object
     * 
     * @returns {paperSize}
     */
    getPapersize: function()
    {
        var paperSize = typeof this.options.paperSize == "function" ? this.options.paperSize() : this.options.paperSize;
        if (paperSize == null)
            return null;

        if (this.options.header !== null)
            paperSize.header = this.options.header();
        if (this.options.footer !== null)
            paperSize.footer = this.options.footer();
        
        return paperSize;
    },

    getViewportSize: function()
    {
        if (this.options.viewportSize == null)
            return null;

        return typeof this.options.viewportSize == "function" ? this.options.viewportSize() : this.options.viewportSize;
    },

    getName: function()
    {
        var name = typeof this.options.name == "function" ? this.options.name() : this.options.name;
        if (name.length == 0 || typeof name != "string")
            name = "export";
        return name;
    },

    /**
     * Images in header are not displayed.
     *
     * @see https://github.com/ariya/phantomjs/pull/359
     * @param data
     */
    applyHeaderImageHack: function(data)
    {
        if (data.outputType.toLowerCase() == 'svg' || data.outputType.toLowerCase() == 'png')
            return data;

        //no header present
        if (typeof data.paperSize.header.contentsCallbackBody == "undefined")
            return data;

        //no image present
        if (data.paperSize.header.contentsCallbackBody.indexOf('<img') == -1)
            return data;

        //browser safe outerHTML
        var unused = $('<div>');
        unused.append(
            $('<div style="display: none">').append(data.paperSize.header.contentsCallbackBody)
        );
        data.data = unused.html() + data.data;
        return data;
    },

    /**
     * Main function.
     * 
     */
    export: function ()
    {
        this.exportResult.html('<div class="progress progress-striped active"><div class="bar" style="width: 100%;"></div></div>');
        var url = this.options.exportServer + '/exports';

        var data = {
            name: this.getName(),
            inputType: typeof this.options.inputType == "function" ? this.options.inputType() : this.options.inputType,
            outputType: typeof this.options.outputType == "function" ? this.options.outputType() : this.options.outputType,
            data: this.options.dataSelector(),
            styles: typeof this.options.getStyles == "function" ? this.options.getStyles() : this.getStyles(),
            paperSize: this.getPapersize(),
            viewportSize: this.getViewportSize(),
            zoomFactor: typeof this.options.zoomFactor == "function" ? this.options.zoomFactor() : this.options.zoomFactor,
            autoScale: typeof this.options.autoScale == "function" ? this.options.autoScale() : this.options.autoScale
        };
        data = this.applyHeaderImageHack(data);


        var that = this;
        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: url,
            type: 'POST',
            crossDomain: true,
            data: JSON.stringify(data),
            dataType: 'json',
            success: function (result)
            {
                if (result.status != 'OK')
                {
                    that.exportResult.html('');
                    that.exportResult.append('<p class="text-error">There has been a problem generating the output by the server.</p>');
                    window.console && console.log(result);
                    return;
                }


                var link = $('<a class="btn btn-default" target="_blank">Download ' + result.data.fileName + '</a>')
                      .attr('href', that.options.exportServer + '/' + result.data.relativeUrl)
                      .attr('title', 'Download ' + result.data.fileName);

                that.exportResult.html('');
                that.exportResult.append(link);
            },

            error: function (jqXHR, textStatus, errorThrown)
            {
                that.exportResult.html('');
                that.exportResult.append('<p class="text-error">An error has occurred.</p>');
                window.console && console.log(textStatus, errorThrown);
            }
        });

    }
});

