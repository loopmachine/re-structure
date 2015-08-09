import React from 'react';
import {View, emit} from '../../../../src/re-structure';

import {updateBody} from './section';

export default @View class Section extends React.Component {
    static propTypes = {
        section: React.PropTypes.object.isRequired,
        updateSection: React.PropTypes.func.isRequired
    }
    render() {
        let {section, updateSection} = this.props;
        return (
            <div>
                <h2>Section:</h2>
                <div>{section.get('body')}</div>
                <button onClick={() => emit(updateSection, updateBody, {body: "updated page content"})}>update</button>
            </div>
        );
    }
}