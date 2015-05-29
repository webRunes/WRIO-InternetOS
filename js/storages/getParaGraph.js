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
function getParaGraph(str){
      temp = temp + 1;
    var updateArticle = '';
    var isParaLink = false;
    var addedurl = '';
    var lastline = '';

    for (var j = 0; j < finalMetionsArray.length; j += 1) {
        var paragraph = finalMetionsArray[j].para_no;
        var paraLine = finalMetionsArray[j].para_line;
        var linkWord = finalMetionsArray[j].linkWord;
        var newUrl = finalMetionsArray[j].newUrl;

         if (temp === paragraph) {
            if (isParaLink) {
                var linklength = (addedurl.length);
                addedurl += '<a href="' + newUrl + '" ></a>';

                if (linklength !== '' && paraLine > lastline){
                  paraLine += linklength;
                  lastline = finalMetionsArray[j].para_line;
                  linklength = addedurl.length;
                } else {
                  lastline = paraLine;
                  linklength = addedurl.length;
                }
                 updateArticle = getArticleWithLink(updateArticle, paraLine, linkWord, newUrl);

            }else {  // false
                updateArticle = getArticleWithLink(str, paraLine, linkWord, newUrl);
                isParaLink = true;
                lastline = paraLine;
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

module.exports = getParaGraph;
