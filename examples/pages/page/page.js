import Immutable from 'immutable';
import {initSection} from './section/section';

export function initPage({content}) {
    return Immutable.fromJS({
        content,
        sections: {
            '1': initSection({body: "I'm section 1"}),
            '2': initSection({body: "I'm section 2"})
        }
    });
};

// -- commands

export function updateContent(page, {content}) {
    return page.set('content', content);
}

export function updateSection(path) {
    return function command(page, command, ...params) {
        return page.updateIn(path, section => command(section, ...params));
    }
}