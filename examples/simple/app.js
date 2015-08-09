import React from 'react';
import {initApp, emit} from '../../src/re-structure';

import db, {updateTimer} from './db';
import Simple from './Simple.jsx';

// register our db with re-structure. the second param toggles console logging.
initApp(db, false);

// update the timer every second
setInterval(() => emit(updateTimer, {time: new Date()}), 1000);

// render the app
React.render(<Simple />, document.body);
