import React from 'react';
import './App.css';
// import 'materialize-css/dist/css/materialize.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import PricePanel from './PricePanel/PricePanel';
// import SearchBar from  './SearchBar/SearchBar';
import Guide from './Guide/Guide';
import Visualization from './Visualization/Visualization';
import Footer from './Footer/Footer';
import UploadFile from './UploadFile/UploadFile';
import {Nav,Navbar,NavDropdown} from 'react-bootstrap';


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
        <div>
        <Router>
          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link><Link to="/guide" className = "link">Guide</Link></Nav.Link>
                <Nav.Link><Link to="/hospitals" className = "link">Visualization</Link></Nav.Link>
                <Nav.Link><Link to="/upload" className = "link">Upload File</Link></Nav.Link>
              </Nav>
              <Nav>
                <Nav.Link href="#deets">LogIn</Nav.Link>
                <Nav.Link href="#deets">SignUp</Nav.Link>

              </Nav>
            </Navbar.Collapse>
          </Navbar>

          <div>
            <Switch>
              {/*<Route path="/" component={App} />*/}
              <Route path="/guide" component={Guide} />
              <Route path="/hospitals" component={Visualization} />
              <Route path="/upload" component={UploadFile} />
            </Switch>
          </div>
        </Router>
        </div>
        <div style={{"height": "200px"}}>
        </div>

        {/*<SearchBar/>*/}
        {/*<PricePanel/>*/}
        <Footer />
      </div>

  );
  }



}
export default App;
