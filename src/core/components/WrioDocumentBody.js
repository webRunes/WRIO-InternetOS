import React from 'react';
import CreateArticleList from './CreateArticleList';
import WrioDocument from '../store/WrioDocument.js';

class DocumentBody extends React.Component
{

    componentDidUpdate() {
        var hash = window.location.hash;
        window.location.hash = '';
        window.location.hash = hash;
    }

    componentDidMount() {
        this.wrioStore = WrioDocument.listen(this.onDocumentChange.bind(this));
    }

    componentWillUnmount() {
        this.wrioStore();
    }

    onDocumentChange(doc) {
        this.setState(doc);
    }
    
    render() {

        var type = WrioDocument.getListType();
        var data = WrioDocument.getData();
        var content = this.props.content;

        var loading = WrioDocument.getLoading();

        if (loading !== undefined) {
            if (loading.error) {
                return (<div>Error loading page, try again later</div>);
            }

        }

        if (loading === true) {
            return (<img src="https://wrioos.com/Default-WRIO-Theme/img/loading.gif" />);
        }

        switch (type) {
            case 'cover':
            case 'external':
                if (!content) {
                    content = {
                        url: ''
                    };
                }
                return <CreateArticleList data={data} id={content.url} />;
            case 'article':
            default:
                return (
                    <div>
                        <CreateArticleList data={data} id={WrioDocument.getId()} />
                    </div>
                );
        }

    }
}

DocumentBody.propTypes =  {
    content: React.PropTypes.object.isRequired
};

export default DocumentBody;
