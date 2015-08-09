import Immutable from 'immutable';
import {emit} from '../../src/re-structure';
import {initPage} from './page/page';

export function initDb() {
    return Immutable.fromJS({
        currentPage: '1',
        pages: {
            '1': initPage({content: "I'm page 1"}),
            '2': initPage({content: "I'm page 2"})
        },
        modificationCount: 0
    });
}

// -- projections

export function pages(db) {
    return db.get('pages');
}

export function currentPage(db) {
    let currentPageId = db.get('currentPage');
    return [currentPageId, db.getIn(['pages', currentPageId])];
}

export function modificationCount(db) {
    return db.get('modificationCount');
}

// -- commands

export function setCurrentPage(db, {page}) {
    return db.set('currentPage', page);
}

export function updatePage(path) {
    return function command(db, command, ...params) {
        let nextDb = db.updateIn(path, page => command(page, ...params));
        if (pageModified(path, db, nextDb)) {
            return incrementmodificationCount(nextDb);
        }
        return db;
    }
}

function pageModified(path, db, nextDb) {
    return db.getIn(path) !== nextDb.getIn(path);
}

function incrementmodificationCount(db) {
    return db.update('modificationCount', n => n+1);
}