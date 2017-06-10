import React from 'react';
import {getResourcePath} from '../global';
import {getJsonldsByUrl} from '../../widgets/Plus/utils/tools';
import {Card,CardHeader,CardMedia,CardText} from 'material-ui/Card';


export default class CreateInfoTicket extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            img: getResourcePath ('/img/no-photo-200x200.png'),
            readTime: 0
        };
    }

    componentWillMount() {
        var author;
        if (this.props.author && this.props.author != 'unknown') {
            getJsonldsByUrl(this.props.author, (jsons) => {
                if (jsons && jsons.length !== 0) {
                    var j, name;
                    for (j = 0; j < jsons.length; j += 1) {
                        if (jsons[j]['@type'] === 'Article') {
                            author = jsons[j].name;
                            j = jsons.length;
                        }
                    }
                    this.setState({
                        author: author
                    });
                }
            });
        }
        setInterval(() => {
            this.setState({
                readTime: this.state.readTime + 1
            });
        }, 60 * 1000);
    }

    render() {
        return (
            <Card >
                <CardHeader title={this.props.article.name}
                    avatar={this.state.img}/>
                <CardText>
                    <div className="in hidden-xs" id="ticket-element">
                        <div className="media thumbnail">
                            <div className="col-xs-12 pull-right">
                                <img src={this.state.img} className="img pull-left"></img>
                                <ul className="details">
                                    <li>Language: {this.props.article.inLanguage}</li>
                                    <li>Published: {this.props.article.datePublished}</li>
                                    <li>Access: Free</li>
                                    {/*<li>Last modified: {this.props.article.dateModified}</li>
                                     <li>Author: {this.state.author}</li>
                                     <li>Read time: {this.state.readTime} minute(s)</li>
                                     <li>Earned: <span className="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Скрыто для получения вашей независимой оценки, будет открыто после донейта"></span></li>
                                     <li>Views: </li>
                                     <li>Comments: {this.props.article.commentCount}</li>*/}
                                </ul>
                            </div>
                            <div className="col-xs-12">
                                <p ref="about">
                                    {this.props.article.about}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardText>
            </Card>

        );
    }
};

CreateInfoTicket.propTypes = {
    article: React.PropTypes.object.isRequired,
    author: React.PropTypes.string
};
