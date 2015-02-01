function ExportViewportSize()
{
    this.width = null;
    this.height = null;
}

ExportViewportSize.prototype.setWidth = function(width)
{
    this.width = width;
};

ExportViewportSize.prototype.getWidth = function()
{
    return this.width;
};

ExportViewportSize.prototype.setHeight = function(height)
{
    this.height = height;
};

ExportViewportSize.prototype.getHeight = function()
{
    return this.height;
};