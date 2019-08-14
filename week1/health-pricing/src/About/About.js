import React from 'react';
import './About.css';


class About extends React.Component {
  render() {
    return (
      <div className='container'>

        <h4></h4>
        <div className="jumbotron">
          <p className="font-weight-bold">About the site:</p>

          <li>
            The site is developed to manipulate, visualize data that is related to health billing for research purposes.
            It creates a domain-specific GUI to manipulate data like Python pandas and more. It is developed with React
            Js, D3, data-forge etc. and is a total client-side web-service.
            It allows user to upload data, filter, sort, aggregate and simply create visualizations.
          </li>
          <li>
            Team: Ben, Kent, Ramzi @ Wash U
          </li>
          <li>
            Disclaimer regarding to data security: the tool is an all client-side webservice. It means that the data
            only exists in client's browser's memory and no data will be posted or stored. After the tab is
            closed, the data in React.js should be destroyed from its lifecycle. However, the site did not take any other security measures
            against
            potential security breaches or hackers in this stage. The site and developer will not be responsible for any leakage
            of data due to using.
          </li>
          <br/>
          <p className="font-weight-bold">Contact:</p>
          <a href="mailto: sling.healthpricing@gmail.com">sling.healthpricing@gmail.com</a>
          <p>For interest in investment or collaboration</p>
        </div>

        <h5>^1.0.0 beta</h5>
        <div className="jumbotron">
          <p>Time : 2019.Aug</p>

          <p className="font-weight-bold">Features:</p>
          <li>
            Supports uploading multiple csv files to compare data.
          </li>
          <li>
            For pre-processing, filter out rows not useful.
          </li>
          <li>
            Browse data with code, provider etc. and sort groups with options of interest.
          </li>
          <li>
            Box plot visualization, tables, statistics, outlier reporting and interactive features on graph.
          </li>
        </div>


      </div>
    );
  }


}

export default About;