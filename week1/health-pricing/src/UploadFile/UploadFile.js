import React from 'react';
import './UploadFile.css';
import Upload from '../Upload/Upload';



/*
*
* this is the parent component with no data
*
* */



class UploadFile extends React.Component {

  //
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     currentStep : null
  //   };
  //
  //
  // }

  render() {
    return (
      <div className = "container">
        <Upload></Upload>
      </div>
    );
  }




}

export default UploadFile;