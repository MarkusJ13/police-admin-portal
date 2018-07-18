import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/css/bootstrap-reboot.css"
import "bootstrap/dist/css/bootstrap-grid.css"
import "bootstrap/dist/js/bootstrap.bundle.js"
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
