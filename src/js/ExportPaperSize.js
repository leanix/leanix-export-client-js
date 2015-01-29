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




