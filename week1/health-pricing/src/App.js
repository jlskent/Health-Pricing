import React from 'react';
import './App.css';
import 'materialize-css/dist/css/materialize.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import PricePanel from './PricePanel/PricePanel';
import SearchBar from  './SearchBar/SearchBar';
import Guide from './Guide/Guide';
import Visualization from './Visualization/Visualization';
import Footer from './Footer/Footer';
import UploadFile from './UploadFile/UploadFile';

import {
  Link,
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";



class App extends React.Component {
  render()
  {
    return(
      <div className="App">
        <Router>
          <div>
            <nav>
              <div className="nav-wrapper light-green darken-3">
                <a className="brand-logo left"><Link to="/">NameOfProject</Link></a>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                  <li><Link to="/guide">Guide</Link></li>
                  <li><Link to="/hospitals">Visualization</Link></li>
                  <li><Link to="/upload">Upload File</Link></li>
                </ul>
              </div>
            </nav>
            <Switch>
              {/*<Route path="/" component={App} />*/}
              <Route path="/guide" component={Guide} />
              <Route path="/hospitals" component={Visualization} />
              <Route path="/upload" component={UploadFile} />
            </Switch>
          </div>
        </Router>

        {/*<SearchBar/>*/}
        {/*<PricePanel/>*/}
        {/*<Footer/>*/}
      </div>
    );
  }



}
export default App;
