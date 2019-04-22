import React, { Component } from 'react';

export class Home extends Component {
  displayName = Home.name

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <p>Welcome to your new single-page application, built with:</p>
        <form>
          <div className="form-row">
            <div className="col">
              <label >Nom</label>
              <input type="text" className="form-control" placeholder="Nom" />
            </div>
            <div className="col">
              <label >Prénom</label>
              <input type="text" className="form-control" placeholder="Prénom" />
            </div>
          </div>

        </form>
        <button className="btn btn-primary"  >Submit form</button>
      </div>
    );
  }
}
