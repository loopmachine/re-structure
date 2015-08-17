import React from 'react';
import {View, emit} from '../../src/re-structure';

// projections
import {pages, currentPage} from './db';

// commands
import {setCurrentPage, updatePageContent, updateSectionBody} from './db';

let PageSection = @View class PageSection extends React.Component {
    static propTypes = {section: React.PropTypes.object.isRequired}
    render() {
        let {section} = this.props;
        return (
            <div>
                <h2>Section:</h2>
                <div>{section.get('body')}</div>
                <button onClick={() => emit(updateSectionBody, {section, body: "updated section content"})}>update</button>
            </div>
        );
    }
}

let Page = @View class Page extends React.Component {
    static propTypes = {page: React.PropTypes.object.isRequired}
    renderSection([id, section]) {
        return <PageSection key={id} section={section} />;
    }
    render() {
        let {page} = this.props;
        return (
            <div>
                <h1>Page:</h1>
                <div>{page.get('content')}</div>
                <button onClick={() => emit(updatePageContent, {page, content: "updated page content"})}>update</button>
                {page.get('sections').entrySeq().map(::this.renderSection)}
            </div>
        );
    }
}

export default @View class Pages extends React.Component {
    static projections = {pages, currentPage};
    renderPageTab([id, page]) {
        return <button key={id} onClick={() => emit(setCurrentPage, {page: id})}>Page {id}</button>
    }
    render() {
        let {pages, currentPage} = this.props;
        return (
            <div>
                {pages.entrySeq().map(::this.renderPageTab)}
                <Page page={currentPage} />
            </div>
        );
    }
}