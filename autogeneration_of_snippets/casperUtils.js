
// patching phantomjs' require()
var require = patchRequire(require);

exports.setupEvents = function(casperInstance) {
    var casper = casperInstance;

	casper.on('http.status.404', function(resource) {
	    this.echo('wait, this url is 404: ' + resource.url);
	});

	casper.on('http.status.500', function(resource) {
	    this.echo('woops, 500 error: ' + resource.url);
	});

	casper.start('http://mywebsite/404', function() {
	    this.echo('We suppose this url return an HTTP 404');
	});
};
exports.stepLog = function(casperInstance){
	require('utils').dump(casperInstance.steps.map(function(step) {
	    return step.toString();
	}));
}