import React from 'react';
import {initApp, emit} from '../../src/re-structure';

import db, {updateTimer} from './db';
import App from './views/App.jsx';

initApp(db);

// render the app
React.render(<App />, document.body);
