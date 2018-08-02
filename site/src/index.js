import React from 'react';
import ReactDOM from 'react-dom';
import {Route, Switch} from 'react-router';
import {BrowserRouter} from 'react-router-dom'
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import createBrowserHistory from 'history/createBrowserHistory';

import Cook from './Cook';
import AddRecipe from './AddRecipe';
import List from './List';

const history = createBrowserHistory()

ReactDOM.render(
    <BrowserRouter history={history}>
            <Switch>
            <Route path="/cook" component={Cook}/>
            <Route path="/add" component={AddRecipe}/>
            <Route path="/" component={List}/>
        </Switch>
    </BrowserRouter>,
    document.getElementById('root')
);
registerServiceWorker();