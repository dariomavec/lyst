import React from 'react';
import ReactDOM from 'react-dom';
import {Route, Switch} from 'react-router';
import {BrowserRouter} from 'react-router-dom'
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';

import Cook from './list/Cook';
import List from './list/List';

import WebFont from 'webfontloader';


WebFont.load({
  google: {
    families: ['Proza Libre:300,400,700', 'sans-serif']
  }
});

ReactDOM.render(
    <BrowserRouter>
            <Switch>
            <Route path="/cook" component={Cook}/>
            <Route path="/" component={List}/>
        </Switch>
    </BrowserRouter>,
    document.getElementById('root')
);
registerServiceWorker();