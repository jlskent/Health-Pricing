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
        <div>
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              <li className="page-item"><a className="page-link" href="#">Previous</a></li>
              <li className="page-item"><a className="page-link" href="#">Upload File</a></li>
              <li className="page-item"><a className="page-link" href="#">Choose a Variable</a></li>
              <li className="page-item"><a className="page-link" href="#">Visualization</a></li>
              <li className="page-item"><a className="page-link" href="#">Next</a></li>
            </ul>
          </nav>

        </div>



      </div>
    );
  }




}

export default UploadFile;