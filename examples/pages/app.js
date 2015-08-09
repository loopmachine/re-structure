import React from 'react';
import {initApp, emit} from '../../src/re-structure';

import {initDb} from './db';
import Pages from './Pages.jsx';

initApp(initDb());

// render the app
React.render(<Pages />, document.body);
