function ExportMarginObject()
{
    this.height = '';
    this.content = '';
}

ExportMarginObject.prototype.setHeight = function(height)
{
    this.height = height;
};

ExportMarginObject.prototype.getHeight = function()
{
    return this.height;
};

ExportMarginObject.prototype.setContent = function(content)
{
    this.content = content;
};

ExportMarginObject.prototype.getContent = function()
{
    return this.content;
};

