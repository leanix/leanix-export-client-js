function ExportData()
{
    this.name = 'export';
    this.inputType = 'html';
    this.outputType = 'pdf';
    this.styles = null;
    this.data = '';
    this.paperSize = new ExportPaperSize();
    this.autoScale = false;
    this.zoomFactor = 1;
    this.viewportSize = new ExportViewportSize();
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

ExportData.prototype.finalizeData = function(data)
{
    data.find('.modal-backdrop').remove().end()
        .find('.noExport').remove().end();

    return data.html().replace(/€/g, '&euro;').replace(/·/g, '&middot;');
};

ExportData.prototype.encodeImage = function (image)
{
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    image.src  = canvas.toDataURL("image/png");
};

ExportData.prototype.setElement = function(element, callback, doClone)
{
    if (typeof doClone == 'undefined') doClone = true;

    var data = element;
    if (doClone)
        data = element.clone();

    var result = data.wrap('<div>').parent();

    var that = this;
    result.find('img').each(function () {
        that.encodeImage(this);
    });

    if (typeof callback == 'function')
        callback(result);

    this.setData(this.finalizeData(result));
    if (this.styles == null)
        this.extractStyles();
};

ExportData.prototype.selectData = function(dataSelector, callback)
{
    var element = $(dataSelector);

    if (!element.length)
        throw 'Unable to find data selector ' + dataSelector;

    this.setElement(element, callback, true);
};

ExportData.prototype.extractStyles = function()
{
    var buffer = "";
    for (var i = 0; i < document.styleSheets.length; i++)
    {
        try
        {
            if (document.styleSheets[i].cssRules)
            {
                for (var j = 0; j < document.styleSheets[i].cssRules.length; j++)
                {
                    buffer += document.styleSheets[i].cssRules[j].cssText;
                }
            }
        }
        catch (e)
        {
            if(e.name !== 'SecurityError')
                throw e;
        }
    }

    var getLocation = function()
    {
        var l = document.createElement("a");
        l.href = window.location.href;
        return l;
    };
    var hostname = getLocation().hostname.replace(/\./g, '\\.');
    var protocol = getLocation().protocol;

    var regExp = new RegExp(protocol + '//' + hostname, 'g');
    buffer = buffer.replace(regExp, "..");

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

ExportData.prototype.setAutoScale = function(autoScale)
{
    this.autoScale = autoScale;
};

ExportData.prototype.getAutoScale = function()
{
    return this.autoScale;
};

ExportData.prototype.setZoomFactor = function(zoomFactor)
{
    this.zoomFactor = zoomFactor;
};

ExportData.prototype.getZoomFactor = function()
{
    return this.zoomFactor;
};

ExportData.prototype.setViewportSize = function(viewportSize)
{
    this.viewportSize = viewportSize;
};

ExportData.prototype.getViewportSize = function()
{
    return this.viewportSize;
};




