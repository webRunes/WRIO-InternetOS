var React = require('react'),
    cssUrl = require('../global').cssUrl,
    theme = require('../global').theme;

var CreateCover = React.createClass({

    render: function() {
        var cover = this.props.data;
        var path = cssUrl + theme + "/img/sign_in-cover1.jpg"; //cover.img;
        var name = cover.name
        var isActive = this.props.isActive ? 'item active' : 'item'
        return (
            <div className={isActive}>
                <div className="img" style={{background: "url(" + path + ") center center"}}></div>
                <div className="carousel-caption">
                    <div className="carousel-text">
                        <h2>{name}</h2>
                        <ul className="features">
                            <li><span className="glyphicon glyphicon-ok"></span>подбор интересного контента на основе <a href="http://webrunes.com/blog.htm?First-url-title">ваших предпочтений</a></li>
                            <li><span className="glyphicon glyphicon-ok"></span>отображение и организация любимых сайтов в удобном для вас виде</li>
                            <li><span className="glyphicon glyphicon-ok"></span><a href="http://webrunes.com/blog.htm?First-url-title">единый каталог</a> всех ваших статей, книг, фото / аудио / видео материалов</li>
                            <li><span className="glyphicon glyphicon-ok"></span>возможность поддержки ваших любимых авторов материально</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = CreateCover;
