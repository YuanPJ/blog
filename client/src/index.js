import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import BlogHome from './js/BlogHome';
import BlogPost from './js/BlogPost';

injectTapEventPlugin();

const App = () => (
  <MuiThemeProvider>
    {/*<Header />*/}
    <Body />
  </MuiThemeProvider>
);

// const Header = () => (
//     <div className="Header">
//         <h1>Blog</h1>
//         <nav>
//             <button><Link to='/'>Home</Link></button>
//             <button><Link to='/addpost'>Add Post</Link></button>
//         </nav>
//     </div>
// )

const Body = () => (
  <Switch>
    <Route exact path="/" component={BlogHome} />
    <Route path="/post/:postId" component={BlogPost} />
  </Switch>
);

ReactDOM.render((
  <Router>
    <App />
  </Router>
  ),
  document.getElementById('app'),
);
