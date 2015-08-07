import Immutable from 'immutable';

export default Immutable.fromJS({
    currentPage: 1,
    pages: {
        '1': {
            content: "I'm page one"
        },
        '2': {
            content: "I'm page two"
        }
    }
});

// -- projections

export function page(db, {number}) {
    return db.getIn(['pages', number.toString()]);
}

// -- commands

export function changePage(db, {page}) {
    return db.set('currentPage', page);
}