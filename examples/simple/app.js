import React from 'react';
import {initApp, emit} from '../../src/re-structure';

import db, {updateTimer} from './db';
import Simple from './Simple.jsx';

// register our db with re-structure, log a projection to the console
initApp(db, {logProjections: db => db.get('timer')});

// update the timer every second
setInterval(() => emit(updateTimer, {time: new Date()}), 1000);

// render the app
React.render(<Simple />, document.body);
