import React from 'react';
import './About.css';



class About extends React.Component {
  render() {
    return (
      <div className='container'>

        <h4>About</h4>
        <div className="jumbotron">
          <p>
            The site is.
          </p>
        </div>

        <h4>^1.0.0 beta</h4>
        <div className="jumbotron">
          <p>
            Time :
          </p>

          <p>
            Team :
          </p>


          <p>
            Disclaimer :
          </p>
        </div>


      </div>
    );
  }


}

export default About;