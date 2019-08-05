import * as d3 from "d3";
import React from "react";



class Step extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      color : 'grey'
    }
  }



  // componentWillMount(){
  //   if (this.props.label === this.props.currentStep) {
  //     this.setState ({color : 'green' });
  //     console.log('set color')
  //   }
  // }

  componentDidUpdate(){
    // if (this.props.label === this.props.currentStep) {
    //   this.state.color ='green';
    //   console.log('set color')
    // }
  }


  render() {

    // console.log(this.props.label)
    // console.log(this.props.currentStep)

    // if (this.props.currentStep )



    return (
      <div className='close-icon'>
        <svg height="100" width="100" id = {this.props.id}>
          <g>
            <circle cx="30" cy="30" r="15" fill={this.state.color}/>
          </g>
        </svg>
      </div>
    )
  };

}
export default Step;