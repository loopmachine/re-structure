import Immutable from 'immutable';
import {emit} from '../../src/re-structure';

export function initDb() {
    return Immutable.fromJS({
        currentPage: '1',
        pages: {
            '1': initPage({
                key: {id: '1'},
                content: "I'm page 1",
                sections: {
                    '1': initPageSection({
                        key: {id: '1', page: '1'},
                        body: "I'm section 1"
                    }),
                    '2': initPageSection({
                        key: {id: '2', page: '1'},
                        body: "I'm section 2"
                    })
                }
            }),
            '2': initPage({
                key: {id: '2'},
                content: "I'm page 2",
                sections: {
                    '1': initPageSection({
                        key: {id: '1', page: '2'},
                        body: "I'm section 1"
                    })
                }
            })
        }
    });
}

function initPage({key, content, sections}) {
    return Immutable.fromJS({
        key,
        content,
        sections
    });
}

export function initPageSection({key, body}) {
    return Immutable.fromJS({
        key,
        body
    });
};

// -- projections

export function pages(db) {
    return db.get('pages');
}

export function currentPage(db) {
    let currentPageId = db.get('currentPage');
    return db.getIn(['pages', currentPageId]);
}

// -- commands

export function setCurrentPage(db, {page}) {
    return db.set('currentPage', page);
}

// Page

export function updatePageContent(db, {page, content}) {
    let key = pagePath(page.get('key'));
    return db.updateIn(key, page => page.set('content', content));
}

function pagePath(key) {
    return ['pages', key.get('id')];
}

// PageSection

export function updateSectionBody(db, {section, body}) {
    let key = pageSectionPath(section.get('key'));
    return db.updateIn(key, section => section.set('body', body));
}

function pageSectionPath(key) {
    return ['pages', key.get('page'), 'sections', key.get('id')];
}