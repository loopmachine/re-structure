import Immutable from 'immutable';

export function initSection({body}) {
    return Immutable.fromJS({
        body
    });
};

// -- commands

export function updateBody(section, {body}) {
    return section.set('body', body);
}