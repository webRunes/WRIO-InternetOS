var React = require('react'),
    importUrl = require('../global').importUrl,
    theme = require('../global').theme;

module.exports = React.createClass({
  propTypes: {
    converter: React.PropTypes.object.isRequired
  },
  loadArticleFromServer: function(title,children,hasPart,rawMarkup) {
  var url = importUrl + theme + '/widget/article.htm';  // Article Path  
  var CreateArticleID = title.replace(/\s/g, '_'); // Article ID
  $.ajax({
      url: url,
      dataType: 'html',
     // data: { haspart : title },
      success: function(data) {
     //alert(data);
     if(hasPart === true){
        if(rawMarkup==""){
            var html = '<h2 id="{this.props.articleid}">{this.props.articlename}</h2>';
        }else{
            var html = data.replace('<header class="col-xs-12"><h1 id="{this.props.articleid}">{this.props.articlename}</h1></header>','<h2 id={this.props.articleid}>{this.props.articlename}</h2>');
        }
      }else{
        var html=data;
      }
      var res = html.replace(/{this.props.articlename}/g,title);
      res = res.replace(/{this.props.articleid}/g, CreateArticleID);
       res = res.replace("{description}",children);
       res = res.replace(/<p>/g,'<div class="paragraph"><div class="col-xs-12 col-md-6"><p itemprop="description">');
       res = res.replace(/p>/g,'</p></div><div class="col-xs-12 col-md-6"><aside><span class="glyphicon glyphicon-comment" data-toggle="tooltip" data-placement="right" title="Not yet available"></span></aside></div></div>');
       this.setState({data: res});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    var rawMarkup = this.props.converter.makeHtml(this.props.children.toString());
    this.loadArticleFromServer(this.props.articlename, this.props.children, this.props.hasPart,rawMarkup);
  },
  render: function() {
    return (
      <section dangerouslySetInnerHTML={{__html: this.state.data}} />
    );
  }
});
