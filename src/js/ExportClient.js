function ExportClient(serverUrl)
{
    this.serverUrl = serverUrl;
}

ExportClient.prototype.setServerUrl = function(url)
{
    this.serverUrl = url;
};

ExportClient.prototype._submit = function(type, endpoint, exportData, onSuccess, onError)
{
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: this.serverUrl + endpoint,
        type: type,
        data: JSON.stringify(exportData),
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
                if (typeof onSuccess == 'function')
                    onSuccess(result);
            }
        }
    });
}

ExportClient.prototype.export = function (exportData, onSuccess, onError)
{
    this._submit('POST', '/exports/', exportData, onSuccess, onError);
};

ExportClient.prototype.getDimension = function (exportData, onSuccess, onError)
{
    this._submit('POST', '/dimensions/', exportData, onSuccess, onError);
};
