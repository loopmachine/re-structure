import React from 'react';
import {View, emit} from '../../../src/re-structure';

import {changePage} from '../db';
import Page from './Page.jsx';

export default @View class App extends React.Component {
    static projections = {
        currentPage: db => db.get('currentPage')
    };
    render() {
        return (
            <div>
                <button onClick={() => emit(changePage, {page: 1})}>Page 1</button>
                <button onClick={() => emit(changePage, {page: 2})}>Page 2</button>
                <Page num={this.props.currentPage} />
            </div>
        );
    }
}