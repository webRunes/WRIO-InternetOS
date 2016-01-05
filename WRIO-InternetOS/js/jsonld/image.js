var Image = function(opts) {
	// Example:
	//{
	//    "@type": "Article",
	//    "name": "First url title",
	//    "about": "Text inside the ticket popup.",
	//    "url": "http://webrunes.com/blog.htm?'dolor sit amet':1,104"
	//},
	this.name = opts.name;
	this.url = opts.contentUrl;
	var cutUrl = this.url.split('?'),
		positions = cutUrl[1].split(',');
	this.newUrl = cutUrl[0];
	this.order = Number(positions[0]);
	this.start = Number(positions[1]);
};

Image.prototype.warn = function(text) {
	text = text || 'Wrong image: ' + this.url;
};

Image.prototype.attach = function(s) {
	var before = s.substr(0, this.start),
		after = s.substring(this.start, s.length);
	return {
		before: before,
		image: {
			src: this.newUrl
		},
		after: after
	};
};

module.exports = Image;