import React from 'react';
import {View, emit} from '../../../src/re-structure';

import {page} from '../db';

export default @View class Page1 extends React.Component {
    static projections = props => ({
        page: db => page(db, {number: props.num})
    });
    render() {
        return (
            <div>
                <h1>Page {this.props.num}:</h1>
                <div>{this.props.page.get('content')}</div>
            </div>
        );
    }
}