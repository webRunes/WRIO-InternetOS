import React from 'react';
import CreateArticleList from './CreateArticleList';
import WrioDocument from '../store/WrioDocument.js';

class DocumentBody extends React.Component
{

    componentDidUpdate() {

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
};

export default DocumentBody;
