import React from 'react';
import './Guide.css';



class Guide extends React.Component {
  render() {
    return (
      <div className="col s12 m7">
        <h2 className="header">Search Medical Cost</h2>
        <div className="card horizontal">
          <div className="card-image">
            <img src="https://lorempixel.com/100/190/nature/6" />
          </div>
          <div className="card-stacked">
            <div className="card-content">
              <p>I am a very simple card. I am good at containing small bits of information.</p>
            </div>
            <div className="card-action">
              <a href="#">This is a link</a>
              <i className="material-icons">add</i>

            </div>
          </div>
        </div>
      </div>
    );
  }


}

export default Guide;