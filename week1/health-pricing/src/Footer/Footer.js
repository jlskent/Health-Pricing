import React from 'react';
import './Footer.css';



class Footer extends React.Component {
  render() {
    return (
      <div className="fixed-bottom">
        <footer className="blog-footer">
          <div className="container">
            {/*<span className="text-muted">copyright 2019</span>*/}
            <p>Blog template built for <a href="https://getbootstrap.com/">Bootstrap</a> by <a
              href="https://twitter.com/mdo">@mdo</a>.</p>
            <p>
              <a href="#">Back to top</a>
            </p>
          </div>
        </footer>
      </div>

    );
  }


}

export default Footer;