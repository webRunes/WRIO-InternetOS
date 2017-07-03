import React from 'react';
import {getResourcePath} from '../global.js';
import UrlMixin from '../mixins/UrlMixin';
import Thumbnail from './misc/ListThumbnail.js';

// TODO check if it is needed ?

class ItemListElement extends React.Component {


    render() {
        var item = this.props.data,
            title = item.getKey('name'),
            image = item.data.image || getResourcePath('/img/no-photo-200x200.png'),
            about = item.getKey('about'),
            url = item.getKey('url'),
            createdDate = item.getKey('datePublished');

        return (
            <a href={UrlMixin.fixUrlProtocol(url)}>
              <article>
                <div className="media thumbnail clearfix" >
                  <header className="col-xs-12">
                    <h2>
                      {title}
                    </h2>
                  </header>
                  <div className="col-xs-12 col-md-6 pull-right">
                    <Thumbnail image={image} />
                    <ul className="details">
                      <li>Created: {createdDate}</li>
                      <li>Access: Free</li>
                    </ul>
                  </div>

                  <div className="col-xs-12 col-md-6">
                    <p>{about}</p>
                  </div>
                </div>
              </article>
            </a>
        );
    }
}

ItemListElement.propTypes =  {
    data: React.PropTypes.object.isRequired
};

export default class ItemList extends React.Component {
    render () {
        const list = this.props.data;

        let r = list.children.map((item, key) => {
            return <ItemListElement data={item} key={key}/>;
        });

       // if (list.data.name) {
       //     <article />;
       // }
        return (<div>
            <div className="paragraph list-paragraph">
              <div className="col-xs-12 col-md-12">
                {list.data.description}
              </div>
            </div>
            {r}
        </div>);
    }
}

ItemList.propTypes =  {
    data: React.PropTypes.object.isRequired
};
