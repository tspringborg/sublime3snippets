var fs = require('fs');
var utils = require('utils');
var casperUtils = require('./casperUtils');

var casper = require('casper').create({
  verbose: true,
  logLevel: 'error',
  pageSettings: {
    loadImages: false,
    loadPlugins: false,
    // userAgent: 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.2 Safari/537.36'
    userAgent: 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36'
  },
  clientScripts: ['lib/jquery.min.js'] // Inject jquery library, allows use of $ variables
});

var baseUrl = 'https://lodash.com/docs';
// var baseUrl = 'http://google.com';

casper.start(baseUrl, function(){
	this.echo('loaded '+baseUrl);
  this.echo('reading snippets from the page')
  
  var snippets = this.evaluate(function(){
        var returnArray = [jQuery('body').html()];
        // returnArray.push($(this).html());
        // $('h3').each(function(){
          // returnArray.push($(this).html());
          // var snippet = $(this).html();
          // var explanation = $(this).parent();
          // var header = explanation.find('.header');
          // var snippetName = header.html();
          // header.remove();
          // explanation.find('code').remove();
          // explanation = explanation.html();
          // var regex = /(<([^>]+)>)/ig;
          // explanation = explanation.replace(regex, "");
          // explanation = explanation.replace(/\n/ig, "");
          // explanation = explanation.replace(/  /ig, "");
          // returnArray.push({name:snippetName, snippet:snippet, explanation:explanation});
        // })
        return returnArray;
      })
  utils.dump(snippets);
  // writeSnippets(snippets, '../js/underscore/js.underscore.{name}.sublime-snippet');
});
//then.end.


var snippetTemplate = "<snippet><content><![CDATA[{content}]]></content><tabTrigger>{trigger}</tabTrigger><description>{description}</description><scope>source.js</scope></snippet>";
var writeSnippets = function(arr, nameTemplate){
  for (var i = arr.length - 1; i >= 0; i--) {
    var snippet = arr[i];
    var fileName = nameTemplate.replace('{name}', snippet.name);

    //split explanation into more manageable lines
    var x = snippet.explanation.split(' ');
    snippet.explanation = "";
    for(var word = 0; word<x.length; word++){
      if(word%10 == 0 && word != 0){
        snippet.explanation+='\n';
      }
      snippet.explanation+=x[word]+" ";
    }

    var snippetContent = '${1:/*\n'+snippet.explanation+'*/\n}';

    var s = snippet.snippet.split('(');
    var args = s[1].replace(')', "").replace(' ', '').split(',');
    s = s[0];

    s+='(';
    for(var j = 0; j<args.length; j++){
      s+='${'+(j+2)+':'+args[j]+'}';
      if(j<args.length-1) s+=",";
      else s+=')';
    }
    snippetContent = snippetContent+s;
    var snippetFile = snippetTemplate.replace("{content}", snippetContent);
    snippetFile = snippetFile.replace("{description}", "underscore - "+snippet.name);
    snippetFile = snippetFile.replace("{trigger}", "_\."+snippet.name);
    fs.write(fileName, snippetFile);
  };
}

casper.run();