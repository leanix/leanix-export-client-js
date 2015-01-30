QUnit.test( "ExportData", function( assert )
{
    var data = new ExportData();
    data.setName('Application_Portfolio');

    assert.ok('Application_Portfolio' == data.getName());
});