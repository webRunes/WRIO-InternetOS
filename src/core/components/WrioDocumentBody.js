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

        var search = WrioDocument.getUrlSearch();
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

        return <CreateArticleList/>;


    }
}

DocumentBody.propTypes =  {
    content: React.PropTypes.object.isRequired
};

export default DocumentBody;
