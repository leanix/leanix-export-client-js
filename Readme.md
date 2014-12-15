# leanix-export-client-javascript

This widget handles print exports to leanix-export printing microservice.

## Usage

```
var options = {
    exportServer: "https://my.export.server",
    dataSelector: function(){ return $('#abc').html();}
};

$('#myElement').exportclient(options);
$('#myElement').exportclient('export'); //trigger manually
```

### Options:

* _exportServer_ (url): service url (without "/exports" endpoint)
* _dataSelector_ (string|function):  selects the data to send to the service. If a string is is used with a selector and outerHTML is taken.
* _name_ (string): name of the file
* inputType (string|function): HTML | SVG or a function returning the input type string
* outputType (string|function): SVG | PNG | JPG | PDF or a function returning a proper format string
* paperSize (function|object): phantomJS papersize object (without header or footer, these can be set separately) or a function returning such an object
* header and footer (object): header object { margin: "1cm", contentsCallbackBody: "someString"}