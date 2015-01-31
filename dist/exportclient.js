/** Copyright LeanIX GmbH 2014 **/
function ExportData()
{
    this.name = 'export';
    this.inputType = 'html';
    this.outputType = 'pdf';
    this.styles = '';
    this.data = '';

    this.paperSize = new ExportPaperSize();
}

ExportData.prototype.INPUT_HTML = 'html';

ExportData.prototype.setName = function(name)
{
    this.name = name;
};

ExportData.prototype.getName = function()
{
    return this.name;
};

ExportData.prototype.setData = function(data)
{
    this.data = data;
};

ExportData.prototype.getData = function()
{
    return this.data;
};

ExportData.prototype.extractStyles = function()
{
    var buffer = "";
    for (var i = 0; i < document.styleSheets.length; i++)
    {
        if (document.styleSheets[i].cssRules)
        {
            for (var j = 0; j < document.styleSheets[i].cssRules.length; j++)
            {
                buffer += document.styleSheets[i].cssRules[j].cssText;
            }
        }
    }

    this.setStyles(buffer);
};

ExportData.prototype.setStyles = function(data)
{
    this.styles = data;
};

ExportData.prototype.getStyles = function()
{
    return this.data;
};

ExportData.prototype.setInputType = function(inputType)
{
    this.inputType = inputType;
};

ExportData.prototype.getInputType = function()
{
    return this.inputType;
};

ExportData.prototype.setOutputType = function(outputType)
{
    this.outputType = outputType;
};

ExportData.prototype.getOutputType = function()
{
    return this.outputType;
};

ExportData.prototype.getPaperSize = function()
{
    return this.paperSize;
};



function ExportClient(serverUrl)
{
    this.serverUrl = serverUrl;
}

ExportClient.prototype.setServerUrl = function(url)
{
    this.serverUrl = url;
};

ExportClient.prototype.export = function (exportData, onSuccess, onError)
{
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: this.serverUrl + '/exports',
        type: 'POST',
        data: JSON.stringify(exportData),
        dataType: 'json',
        cache: false,
        async: true,
        success: function (result)
        {
            if (result.status != 'OK')
            {
                if (typeof onError == 'function')
                    onError(result);
            }
            else
            {
                if (typeof onSucess == 'function')
                    onSuccess(result);
            }
        }
    });
};


function ExportPaperSize()
{
    this.format = '';
    this.orientation = '';
    this.margin = '';
    this.header = new ExportMarginObject();
    this.footer = new ExportMarginObject();
}

ExportPaperSize.prototype.setFormat = function(format)
{
    this.format = format;
};

ExportPaperSize.prototype.getFormat = function()
{
    return this.format;
};

ExportPaperSize.prototype.setOrientation = function(orientation)
{
    this.orientation = orientation;
};

ExportPaperSize.prototype.getOrientation = function()
{
    return this.orientation;
};

ExportPaperSize.prototype.setMargin = function(margin)
{
    this.margin = margin;
};

ExportPaperSize.prototype.getMargin = function()
{
    return this.margin;
};

ExportPaperSize.prototype.getHeader = function()
{
    return this.header;
};

ExportPaperSize.prototype.getFooter = function()
{
    return this.footer;
};





function ExportMarginObject()
{
    this.height = '';
    this.contents = '';
    this.images = [];
}

ExportMarginObject.prototype.setHeight = function(height)
{
    this.height = height;
};

ExportMarginObject.prototype.getHeight = function()
{
    return this.height;
};

ExportMarginObject.prototype.setContents = function(contents)
{
    this.contents = contents;
};

ExportMarginObject.prototype.getContents = function()
{
    return this.contents;
};

ExportMarginObject.prototype.setImages = function(images)
{
    this.images = images;
};

ExportMarginObject.prototype.getImages = function(images)
{
    return this.images;
};

ExportMarginObject.prototype.addImage = function(image)
{
    this.images.push(image);
};

