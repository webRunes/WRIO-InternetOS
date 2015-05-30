var finalMetionsArray = require('./finalMetionsArray');

// function for replace word to link word
function getArticleWithLink(str, replaceleng, word, newUrl){
      var res1 = str.substring(0, replaceleng);
      var lengWithWord = word.length + replaceleng;
      var res2 = str.substring(lengWithWord);
      return res1.concat('<a href="' + newUrl + '" >' + word + '</a>' + res2);
} // end function


var temp = 0;
// for get article paragraph with link
function getParagraph(str){
      temp = temp + 1;
    var updateArticle = '';
    var isParagraphLink = false;
    var addedurl = '';
    var lastline = '';

    for (var j = 0; j < finalMetionsArray.length; j += 1) {
        var paragraph = finalMetionsArray[j].paragraphNo;
        var paragraphLine = finalMetionsArray[j].paragraphLine;
        var linkWord = finalMetionsArray[j].linkWord;
        var newUrl = finalMetionsArray[j].newUrl;

         if (temp === paragraph) {
            if (isParagraphLink) {
                var linklength = (addedurl.length);
                addedurl += '<a href="' + newUrl + '" ></a>';

                if (linklength !== '' && paragraphLine > lastline){
                  paragraphLine += linklength;
                  lastline = finalMetionsArray[j].paragraphLine;
                  linklength = addedurl.length;
                } else {
                  lastline = paragrLine;
                  linklength = addedurl.length;
                }
                 updateArticle = getArticleWithLink(updateArticle, paragraphLine, linkWord, newUrl);

            }else {  // false
                updateArticle = getArticleWithLink(str, paragraphLine, linkWord, newUrl);
                isParagraphLink = true;
                lastline = paragraphLine;
                addedurl = '<a href="' + newUrl + '" ></a>';
            }
                } // if loop end
     } // for loop end
    if (updateArticle === '') {
       return str;
    }else{
       return updateArticle;
    }
} // end function

module.exports = getParagraph;
