import React from 'react';
import './PricePanel.css';
import PriceComponent from '../PriceComponent/PriceComponent';



class PricePanel extends React.Component {
  constructor() {
    super(); // inherit parent methods
    this.state = {results : null}
  }

  // load after constructor
  componentDidMount(){
    this.loadData();
  }

  //iterate results
  renderResults(){
    // take each element in results dictionary
    const result_list = this.state.results.map(x => {
      return(
        <a>
          <PriceComponent result = {x}></PriceComponent>
        </a>
      );
    })
    //iterate result list
    return (
        <div className = 'list-group'>
          {result_list}
        </div>
    );
  }



  render(){
    if(!this.state.results){
      return (
        <div>loading</div>
      )
    } else {
      return (
        <div>
          {this.renderResults()}
        </div>
      )
    };
  }

  // pull Data from backend
  loadData() {
    this.setState({
      results:
        [{
          "code": 7755003036,
          "description": "ANESTHESIA  - MODERATE SEDATION FOR GASTROINTESTINAL ENDOSCOPY",
          "price": 332,
          "location": "Parkland_Hospital_Pharmacy",
          "i": 4849
        },
        {
          "code": 6635003036,
          "description": "ANESTHESIA  - MODERATE SEDATION FOR GASTROINTESTINAL ENDOSCOPY",
          "price": 332,
          "location": "Parkland_Hospital_Pharmacy",
          "i": 4849
        },
        {
          "code": "51051G0500",
          "description": "ANESTHESIA  - MODERATE SEDATION FOR GASTROINTESTINAL ENDOSCOPY",
          "price": 332,
          "location": "Parkland_Hospital_Pharmacy",
          "i": 4849
        },
        {
          "code": "76650G0500",
          "description": "ANESTHESIA  - MODERATE SEDATION FOR GASTROINTESTINAL ENDOSCOPY",
          "price": 100,
          "location": "Parkland_Hospital_Pharmacy",
          "i": 4849
        },
        {
          "code": 6635003033,
          "description": "ANESTHESIA  - MODERATE SEDATION SERVICES BY PHYSICIAN ALSO PERFORMING A PROCEDURE| ADDITIONAL 15 MINUTES",
          "price": 209,
          "location": "Parkland_Hospital_Pharmacy",
          "i": 4849
        },
        {
          "code": 7755003035,
          "description": "ANESTHESIA  - MODERATE SEDATION SERVICES BY PHYSICIAN NOT PERFORMING A PROCEDURE| EACH ADDITIONAL 15 MINUTES",
          "price": 50,
          "location": "Parkland_Hospital_Pharmacy",
          "i": 4849
        }]
    });
  }




}

export default PricePanel;