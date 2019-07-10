import React from 'react';
import './UploadFile.css';
import Upload from '../Upload/Upload';


class UploadFile extends React.Component {
  render() {
    return (
      <div className = "container">
        <h4 className="pt-md-4">Step 1. upload csv file</h4>
        {/*<p></p>*/}
        <Upload></Upload>
      </div>
    );
  }




}

export default UploadFile;