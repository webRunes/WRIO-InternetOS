var React = require('react'),
    CreateArticleList = require('./CreateArticleList');


var Center = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired,
        content: React.PropTypes.object.isRequired,
        type: React.PropTypes.any
    },
    componentDidUpdate: function() {
        var hash = window.location.hash;
        window.location.hash = '';
        window.location.hash = hash;
    },
    
    render: function() {
        var content = this.props.content,
            data = content.data || this.props.data,
            type = this.props.type;
        if (type === 'Cover') {
            return <CreateArticleList data={data} id={content.url} />;
        } else if (content.type === 'external' || typeof type !== 'undefined') {
            return <CreateArticleList data={data} id={content.url} />;
        } else {
            return (
                <div>
                    <CreateArticleList data={this.props.data} id={content.id} />
                </div>
            );
        }
    }
});

module.exports = Center;
