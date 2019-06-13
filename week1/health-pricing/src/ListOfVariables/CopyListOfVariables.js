// import React from 'react';
// import './ListOfVariables.css';
// import Select from 'react-select';
//
// class ListOfVariables extends React.Component {
//
//
//   constructor(props){
//     // get parent(Update) state
//     super(props);
//     // create some local variables
//     this.state = {
//       xAxisVariables : this.props.columns,
//       yAxisVariables : [],
//       groupByVariables : [],
//       aggregateVariables : []
//
//     };
//
//
//     this.techCompanies = [
//       { label: "Apple", value: 1 },
//       { label: "Facebook", value: 2 },
//       { label: "Netflix", value: 3 },
//       { label: "Tesla", value: 4 },
//       { label: "Amazon", value: 5 },
//       { label: "Alphabet", value: 6 },
//     ];
//
//     // bind event handler
//     this.onXAxisSelected = this.onXAxisSelected.bind(this);
//
//   }
//   componentDidMount() {
//     this.loadData();
//     console.log("from parent "+this.props.columns)
//     console.log("this.xAxisVariables "+this.state.xAxisVariables)
//   }
//
//
//   loadData(){
//     this.setState({ xAxisVariables: this.props.columns })
//   }
//
//
//
//   renderResults(){
//     // take each element in results dictionary
//     const result_list = this.props.columns.map(x => {
//       // console.log("list of var " + x);
//       return(
//         <a className='collection-item'>{x}</a>
//     );
//     });
//     //iterate result list
//     return (
//       <div>
//         <div>
//           <p>x axis</p>
//           <div className = 'collection'>
//             {result_list}
//           </div>
//         </div>
//         <div>
//           <p>y axis</p>
//           <div className = 'collection'>
//             {result_list}
//           </div>
//         </div>
//       </div>
//
//     );
//   }
//
//
//   onXAxisSelected(e) {
//     console.log("THE VAL", e.target.value);
//     //here you will see the current selected value of the select input
//   }
//
//
//   render() {
//
//     if (this.props.columns && this.props.uploadSuccess) {
//       return (
//         <div>
//           <div><h4>List Of Variables</h4></div>
//           <div>
//             {this.renderResults()}
//           </div>
//           <div className="container">
//             <div className="row">
//               <div className="col-md-4"></div>
//               <div className="col-md-4">
//                 <select name="country" >
//                   {this.state.xAxisVariables.map((e, key) => {
//                     return <option key={key} value={e.value}>{e.name}</option>;
//                   })}
//                 </select>
//               </div>
//               <div className="col-md-4"></div>
//             </div>
//           </div>
//
//         </div>
//       );
//     } else{
//       return(
//         <div>
//           <h4>List Of Variables</h4>
//           <p>no content yet</p>
//         </div>
//       );
//     }
//   }
//
//
//
//
//
// }
//
// export default ListOfVariables;