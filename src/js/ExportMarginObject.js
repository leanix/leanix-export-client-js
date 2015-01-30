function ExportMarginObject()
{
    this.height = '';
    this.contents = '';
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

