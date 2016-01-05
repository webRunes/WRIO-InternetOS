class Image {
	constructor(opts) {
		this.name = opts.name;
		this.description = opts.description;
		this.url = opts.contentUrl;
		var cutUrl = this.url.split('?'),
			positions = cutUrl[1].split(',');
		this.newUrl = cutUrl[0];
		this.order = Number(positions[0]);
		this.start = Number(positions[1]);
	}

	warn(text) {
		text = text || 'Wrong image: ' + this.url;
	}

	attach(s) {
		var before = s.substr(0, this.start),
			after = s.substring(this.start, s.length);
		return {
			before: before,
			image: {
				name: this.name,
				description: this.description,
				src: this.newUrl
			},
			after: after
		};
	}
}

module.exports = Image;
