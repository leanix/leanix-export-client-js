var concatenate = require('broccoli-concat'),
    mergeTrees  = require('broccoli-merge-trees'),
    pickFiles   = require('broccoli-static-compiler'),
    filterReact = require('broccoli-react'),
    findBowerTrees = require('broccoli-bower'),
    app = 'src';

var bowerTrees = mergeTrees(findBowerTrees());

var extraAssets = pickFiles('node_modules',{
    srcDir: '/react/dist',
    files: [
        'react-with-addons.js',
    ],
    destDir: '/'
});

var extraAssetsBoot = pickFiles('node_modules',{
    srcDir: '/bootbox.js',
    files: [
        'bootbox.js',
    ],
    destDir: '/'
});

var extraAssetsBootstrap = pickFiles('bower_components',{
    srcDir: '/bootstrap-css/js',
    files: [
        'bootstrap.js',
    ],
    destDir: '/'
});

var htmlFiles = pickFiles('src',{
    srcDir: 'samples',
    files: [
        '*.html',
    ],
    destDir: '/samples'
});

var fonts = pickFiles('bower_components/components-font-awesome', {
    srcDir: '/font',
    files: ['**/*'],
    destDir: '/font'
});


var appJs = concatenate(app, {
    inputFiles : [
        'js/ExportData.js',
        'js/ExportClient.js',
        'js/ExportPaperSize.js',
        'js/ExportMarginObject.js'
    ],
    outputFile : '/lxexportclient.js',
    header     : '/** Copyright LeanIX GmbH 2014 **/'
});

appJs = filterReact(appJs, {extensions: ['js']});


var testJs = concatenate(app, {
    inputFiles : ['test/*.js'],
    outputFile : '/lxexportclient-test.js',
    header     : '/** Copyright LeanIX GmbH 2014 **/'
});



// merge HTML, JavaScript and CSS trees into a single tree and export it
module.exports = mergeTrees([extraAssetsBootstrap, htmlFiles, appJs, testJs, bowerTrees, extraAssets, extraAssetsBoot, fonts], {overwrite: true});
