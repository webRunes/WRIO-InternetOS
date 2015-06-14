var Reflux = require('reflux'),
    finalMenuJsonArray = require('./finalMenuJsonArray'),
    finalListJsonArray = require('./finalListJsonArray'),
    mentionsStore = require('./mentions');

module.exports = Reflux.createStore({
    init: function() {
        var self = this;
        this.listenTo(mentionsStore, function (data) {
            self.trigger(
                self.parse(data)
            );
        });
    },
    getInitialState: function () {
        return [];
    },
    parse: function (json, hasPart, finalJsonArray) {
        var
            i,
            j,
            comment,
            name;

        finalJsonArray = finalJsonArray || [];

        for (j = 0; j < json.length; j += 1) {
            var isArticle;
            comment = json[j];
            if(comment['@type'] === 'Article'){
                isArticle = true;
                name = comment.name;
                finalMenuJsonArray.push({
                    'name': name,
                    'url': '',
                    'class': 'articleView'
                });
                var articlebody = comment.articleBody || '';
                var newArticle = '';
                for (i = 0; i < articlebody.length; i += 1) {
                    newArticle += '<p>' + articlebody[i] + '</p>';
                }
                var articlurl = comment.url || '';
                finalJsonArray.push({
                    'is_article': isArticle,
                    'articlename': comment.name,
                    'articleBody': newArticle,
                    'url': articlurl,
                    'about': comment.about,
                    'hasPart': hasPart ? true : false
                });
            } else if (comment['@type'] === 'ItemList') {
                if(comment.itemListElement !== undefined) {
                    for (i = 0; i < comment.itemListElement.length; i += 1) {
                        name = comment.itemListElement[i].name;
                        var url = comment.itemListElement[i].url;
                        finalMenuJsonArray.push({
                            'name': name,
                            'url': url,
                            'class': 'listView'
                        });
                    }
                }
                if (comment.itemListElement !== undefined) {
                    for (i = 0; i < comment.itemListElement.length; i += 1) {
                        name = comment.itemListElement[i].name;
                        var about = comment.itemListElement[i].about;
                        url = comment.itemListElement[i].url;
                        var image = comment.itemListElement[i].image;
                        var description = comment.itemListElement[i].description;
                        finalListJsonArray.push({
                            'name': name,
                            'author': comment.name,
                            'about': about,
                            'description': description,
                            'url': url,
                            'image': image
                        });
                    }
                }
            }
            if(comment.hasPart !== undefined){
                if (comment.hasPart.length > 0) {
                    this.parse(comment.hasPart, true, finalJsonArray);
                }
            }
        }
        return finalJsonArray;
    }
});
