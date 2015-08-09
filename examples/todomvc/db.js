import Immutable from 'immutable';

// -- initial application db

export function initDb() {
    return Immutable.fromJS({
        todos: {
            '1': {
                id: '1',
                title: 'one',
                done: false
            },
            '2': {
                id: '2',
                title: 'two',
                done: false
            }
        },
        'showing': 'all'
    });
}

// -- projections

export function todos(db) {
    return db.get('todos').toList();
}

export function showing(db) {
    return db.get('showing');
}

export function activeCount(db) {
    return todos(db).filter(todo => !todo.get('done')).count();
}

export function completedCount(db) {
    return todos(db).filter(todo => todo.get('done')).count();
}

export function isAllComplete(db) {
    return todos(db).every(todo => todo.get('done') === true);
}

export function visibleTodos(db) {
    return todos(db).filter(visibilityFilter(showing(db)));
}

function visibilityFilter(showing) {
    switch (showing) {
        case 'active': return todo => !todo.get('done');
        case 'completed': return todo => todo.get('done');
        default: return todo => todo;
    }
}

// -- commmands

export function setShowing(db, {showing}) {
    return db.set('showing', showing);
}

export function deleteTodo(db, {id}) {
    return db.deleteIn(['todos', id]);
}

export function toggleDone(db, {id}) {
    return db.updateIn(['todos', id, 'done'], done => !done );
}

export function clearCompleted(db) {
    return db.update('todos', todos => todos.filterNot(todo => todo.get('done', true)));
}

export function addTodo(db, {title}) {
    let id = nextId(db);
    return db.setIn(['todos', id], Immutable.Map({
        id,
        title,
        done: false
    }));
}

export function toggleCompleteAll(db) {
    return db.update('todos', todos => todos.map(todo => todo.set('done', !isAllComplete(db))))
}

function nextId(db) {
    let currentId = db.get('todos').keySeq().last();
    return currentId === undefined ? 1 : (Number(currentId) + 1).toString();
}
