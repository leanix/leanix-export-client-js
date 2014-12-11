/**
 * leanix-export-client
 * ====================
 *
 * This widget handles print exports.
 *
 * Options:
 * --------
 * dataSelector: a selector to send a dom element to the export service.
 * name: name of the file
 * inputType: HTML | SVG
 * outputType: SVG | PNG | JPG | PDF
 * paperSize: phantomJS papersize object (without header or footer, these can be set separately)
 * header: header object
 * footer: footer object
 */
jQuery.widget("lx.exportclient", {
    options: {
        exportServer: "https://export.leanix.net",
        name: "export",
        inputType: "HTML",
        outputType: 'pdf',
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
        if (this.options.dataSelector === null)
            throw "The dataSelector option must be set.";

        this.outputType = $(
            "<select><option value='pdf'>PDF</option><option value='PNG'>PNG</option><option value='JPG'>JPG</option></select>", 
            { class: 'class="form-control"', id: 'inputType'}
        ).appendTo(this.element);

        if (this.options.paperSize === null)
            this.paperSize = $(
                "<select><option value='A4.portrait'>A4 portrait</option><option value='A4.landscape'>A4 landscape</option><option value='A3.portrait'>A3 portrait</option><option value='A3.landscape'>A3 landscape</option></select>", 
                { class: 'class="form-control"', id: 'inputType'}
            ).appendTo(this.element);
        
        this.exportButton = $("<button>", {
            text: "Export",
            class: "btn btn-default"
        }).appendTo(this.element).button();
        
        this.exportResult = $("<div></div>", {
            id: "export-result"
        }).appendTo(this.element).button();

        this._on(this.exportButton, {click: "export"});
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
        var paperSize;
        if (this.options.paperSize !== null)
            paperSize = this.options.paperSize;
        
        var format = $(this.paperSize).val().split('.')[0];
        var orientation = $(this.paperSize).val().split('.')[1];
        paperSize = {
            format: format,
            orientation: orientation,
            margin: "1cm"
        };
        if (this.options.header !== null)
            paperSize.header = this.options.header;
        if (this.options.footer !== null)
            paperSize.footer = this.options.footer;
        
        return paperSize;
    },
    
    /**
     * Main function.
     * 
     * @param {event} event
     * @returns {undefined}
     */
    export: function (event)
    {
        event.preventDefault();
        var url = this.options.exportServer + '/exports';

        var data = {
            inputType: this.options.inputType,
            outputType: $(this.outputType).val(),
            data: $(this.options.dataSelector).prop('outerHTML'),
            styles: this.getStyles(),
            name: this.options.name,
            paperSize: this.getPapersize()
        };


        this.exportResult.html('Generating ...');
        var that = this;
        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: url,
            type: 'POST',
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

