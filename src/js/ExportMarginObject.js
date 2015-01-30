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

