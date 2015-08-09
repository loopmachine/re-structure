import React from 'react';
import {View, emit} from '../../../src/re-structure';

import {updateContent, updateSection} from './page';
import Section from './section/Section.jsx';

export default @View class Page extends React.Component {
    static propTypes = {
        page: React.PropTypes.object.isRequired,
        updatePage: React.PropTypes.func.isRequired
    }
    renderSection([id, section], path) {
        path = path.concat('sections', id);
        return <Section key={id} section={section} updateSection={updateSection(path)} />;
    }
    render() {
        let {page, updatePage, path} = this.props;
        return (
            <div>
                <h1>Page:</h1>
                <div>{page.get('content')}</div>
                <button onClick={() => emit(updatePage, updateContent, {content: "updated page content"})}>update</button>
                {page.get('sections').entrySeq().map(entry => this.renderSection(entry, path))}
            </div>
        );
    }
}