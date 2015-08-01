import Immutable from 'immutable';

// -- initial application db

export default Immutable.fromJS({
    timer: new Date(),
    timeColor: '#f34'
});

// -- projections

export function timer(db) {
    return db.get('timer');
}

export function timeColor(db) {
    return db.get('timeColor');
}

// -- commands

export function updateTimer(db, {time}) {
    return db.set('timer', time);
}

export function setTimeColor(db, {color}) {
    return db.set('timeColor', color);
}