
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
import {Nav,Navbar} from 'react-bootstrap';
import WelcomePage from './WelcomePage/WelcomePage';


import {
  Link,
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/es/FormControl";



class App extends React.Component {
  render()
  {
    return(
      <div className="App">
          {/*<div className="row">*/}
            <Router>
              <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" >
                <Navbar.Brand href="/" id = "brand">
                  <img
                    alt=""
                    // src="https://img.icons8.com/ultraviolet/40/000000/pill.png"

                    src="https://img.icons8.com/doodle/48/000000/alligator.png"

                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                  />
                    {' Health Pricing'}
                    </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                  <Nav className="mr-auto">
                    <Nav.Link activeClassName="selectedLink"><Link to="/" className = "link" >Home</Link></Nav.Link>
                    <Nav.Link><Link to="/upload" className = "link" >Quick Start</Link></Nav.Link>
                    <Nav.Link><Link to="/pricing" className = "link">Pricing</Link></Nav.Link>
                    <Nav.Link><Link to="/about" className = "link">About</Link></Nav.Link>
                  </Nav>

                  {/*<Form inline>*/}
                    {/*<FormControl type="text" placeholder="Search" className="mr-sm-2" />*/}
                    {/*<Button variant="outline-light">Search</Button>*/}
                  {/*</Form>*/}
                  <Nav>
                    <Nav.Link href="#deets"><Link to="/login" className = "link">Log In</Link></Nav.Link>
                    <Nav.Link href="#deets"><Link to="/signup" className = "link">Sign Up</Link></Nav.Link>
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
