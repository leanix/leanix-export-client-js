/**
 * leanix-export-client
 * ====================
 *
 */
jQuery.widget("lx.exportclient", {
    options: {
        exportServer: "https://export.leanix.net",
        name: "export",
        inputType: "HTML",
        outputType: null,
        dataSelector: null,
        paperSize: null,
        header: null,
        footer: null
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

        if (this.options.dataSelector === null)
            throw "The dataSelector option must be set.";

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
        if (this.options.header !== null)
            paperSize.header = this.options.header;
        if (this.options.footer !== null)
            paperSize.footer = this.options.footer;
        
        return paperSize;
    },

    getPayload: function()
    {
        if (typeof this.options.dataSelector == "function")
            return this.options.dataSelector();

        return $(this.options.dataSelector).prop('outerHTML');
    },

    /**
     * Main function.
     * 
     */
    export: function ()
    {
        var url = this.options.exportServer + '/exports';

        var data = {
            inputType: typeof this.options.inputType == "function" ? this.options.inputType() : this.options.inputType,
            outputType: typeof this.options.outputType == "function" ? this.options.outputType() : this.options.outputType,
            data: this.getPayload(),
            styles: this.getStyles(),
            name: this.options.name,
            paperSize: this.getPapersize()
        };


        this.exportResult.html('<div class="progress progress-striped active"><div class="bar" style="width: 100%;"></div></div>');
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
                    this.exportResult.html('Error during export');
                    return;
                }

                var link = $('<a><img src="' + that.options.exportServer + '/' + result.data.previewUrl + '" alt="preview"/></a>')
                        .attr('href', that.options.exportServer + '/' + result.data.relativeUrl)
                        .attr('title', 'Download ' + result.data.fileName);
                that.exportResult.html('');
                that.exportResult.append(link);
            }
        });

    }
});

