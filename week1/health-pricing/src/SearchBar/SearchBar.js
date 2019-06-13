import React from 'react';
import './SearchBar.css';
import PriceComponent from '../PriceComponent/PriceComponent';



class SearchBar extends React.Component {
  render (){
    return(    <div className="row">
      <div className="col s12 m6">
        <form>
          <div className="input-field">
            <input id="search" type="search" required></input>
            <label className="label-icon" htmlFor="search"><i className="material-icons">search</i></label>
            <i className="material-icons">close</i>
          </div>
          <button className="waves-effect waves-light btn" type="submit" name="action">Search</button>
        </form>
      </div>
    </div>)

  }




}

export default SearchBar;