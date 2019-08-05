
// import 'materialize-css/dist/css/materialize.min.css';
// import WelcomePage from './WelcomePage/WelcomePage';
// import SearchBar from  './SearchBar/SearchBar';
// import Visualization from './Visualization/Visualization';
// import Footer from './Footer/Footer';
import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Guide from './Guide/Guide';

import UploadFile from './UploadFile/UploadFile';
import {Nav,Navbar,NavDropdown} from 'react-bootstrap';
import WelcomePage from './WelcomePage/WelcomePage';


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
          {/*<div className="row">*/}
            <Router>
              <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand href="/">React-Bootstrap</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                  <Nav className="mr-auto">
                    <Nav.Link><Link to="/guide" className = "link">Guide</Link></Nav.Link>
                    <Nav.Link><Link to="/hospitals" className = "link">Visualization</Link></Nav.Link>
                    <Nav.Link><Link to="/upload" className = "link">Upload File</Link></Nav.Link>
                  </Nav>
                  <Nav>
                    <Nav.Link href="#deets"><Link to="/login" className = "link">LogIn</Link></Nav.Link>
                    <Nav.Link href="#deets"><Link to="/signup" className = "link">SignUp</Link></Nav.Link>

                  </Nav>
                </Navbar.Collapse>
              </Navbar>

              <div>
                <Switch>
                  {/*<Route path="/" component={App} />*/}
                  <Route exact path="/" component={WelcomePage} />
                  <Route path="/guide" component={Guide} />
                  {/*<Route path="/hospitals" component={Visualization} />*/}
                  <Route path="/upload" component={UploadFile} />
                </Switch>
              </div>
            </Router>
          {/*</div>*/}



        <div className="">
            {/*<WelcomePage />*/}
        </div>


        <div className="row">
          {/*<Footer />*/}
        </div>


      </div>

  );
  }



}
export default App;
