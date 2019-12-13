import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';

import 'normalize.css';

if (process.env.NODE_ENV === 'development') global.devEnv = true;

ReactDOM.render(<App />, document.querySelector('#root'));
