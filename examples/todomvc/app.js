import React from 'react';
import Immutable from 'immutable';
import Rlite from 'rlite-router';
import {initApp, emit} from '../../src/re-structure';
import {initDb, setShowing} from './db';
import TodoApp from './TodoApp.jsx';

// -- init application db

initApp(initDb());

// -- setup routing

let router = new Rlite();
router.add('', r => emit(setShowing, {showing: 'all'}));
router.add(':filter', r => emit(setShowing, {showing: r.params.filter}));

function processHash() {
    let hash = location.hash || '#';
    router.run(hash.slice(1));
}
window.addEventListener('hashchange', processHash);
processHash();

// -- render the app

React.render(<TodoApp />, document.body);