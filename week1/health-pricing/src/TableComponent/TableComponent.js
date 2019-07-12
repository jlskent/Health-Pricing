import React from 'react';
import './PriceComponent.css';



class PriceComponent extends React.Component {
  render() {
    return (
      <div className="news-description">
        <ul className="collection">
          <li>{this.props.result.price}</li>
          <li>{this.props.result.description}</li>
          <li>{this.props.result.location}</li>
        </ul>
      </div>

          // {/*<div className="row">*/}
          //   {/*<div className="col s1"/>*/}
          //   {/*<div className="col s7">*/}
          //     {/*<div className="news-intro-col">*/}
          //       {/*<div className="news-intro-panel">*/}
          //         {/*<h4>price {this.props.result.price}</h4>*/}
          //         {/*<div className="news-description">*/}
          //           {/*<p>{this.props.result.description}</p>*/}
          //           {/*<div>*/}
          //             {/*{this.props.result.location != null && <div className='chip light-blue news-chip'>{this.props.result.location}</div>}*/}
          //           {/*</div>*/}
          //         {/*</div>*/}
          //       {/*</div>*/}
          //     {/*</div>*/}
          //   {/*</div>*/}
          // {/*</div>*/}
    );
  }




}

export default PriceComponent;