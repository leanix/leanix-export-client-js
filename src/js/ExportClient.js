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
            console.log(result);
            if (result.status != 'OK')
            {
                if (onError)
                    onError(result);
            }
            else
            {
                onSuccess(result);
            }
        }
    });
};

