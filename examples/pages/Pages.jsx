import React from 'react';
import {View, emit} from '../../src/re-structure';

import {pages, currentPage, modificationCount, setCurrentPage, updatePage} from './db';
import Page from './page/Page.jsx';

export default @View class App extends React.Component {
    static projections = {pages, currentPage, modificationCount};
    renderPageTab([id, page]) {
        return <button key={id} onClick={() => emit(setCurrentPage, {page: id})}>Page {id}</button>
    }
    render() {
        let {pages, currentPage: [id, page], modificationCount} = this.props;
        let path = ['pages', id];
        return (
            <div>
                {pages.entrySeq().map(this.renderPageTab)}
                <Page page={page} updatePage={updatePage(path)} path={path} />
                <div style={{paddingTop: 30}}><i>modification count: {modificationCount}</i></div>
            </div>
        );
    }
}