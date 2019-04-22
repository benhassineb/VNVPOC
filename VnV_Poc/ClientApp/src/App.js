import React, { Component } from "react";
import "./App.css";
import Autocomplete from 'react-autocomplete';
import { sortStates, getStates, matchStateToTerm } from "./utils";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { value: 'Ma' };

  }

  onFilesAdded = (evt) => {
    const files = evt.target.files;
    this.analyseFile(files[0]);
  }

  analyseFile = (file) => {
    let formData = new FormData();
    formData.append('file', file);
    fetch('api/SampleData/AnalyseFile', {
      method: 'PUT',
      body: formData
    })
      .then(response => response.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
        this.setState({ ocrResult: { text: response.text, html: { __html: response.html } } })
      });

  }

  render() {
    return (
      <div className="container">
        <div className="card">
          <div className="card-header">Featured </div>
          <div className="card-body">
            <form>
              <div className="form-row">
                <div className="col">
                  <label> Nom </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nom"
                  />
                </div>
                <div className="col">
                  <label> Prénom </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Prénom"
                  />
                </div>
              </div>
              <div className="form-row">
                <label> Adresse </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Adresse" />
              </div>
              <div className="form-row">
                <div className="col">
                  <label> Date </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Adresse" />
                </div>
                <div className="col">
                  <label> Montant </label>
                  <div className="input-group" >
                    <input type="text" className="form-control" aria-label="Dollar amount (with dot and two decimal places)" />
                    <div className="input-group-append">
                      <span className="input-group-text">$</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-row">
                <label>Example file input</label>
                <input type="file" className="form-control-file"
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={this.onFilesAdded}
                />
              </div>

              <Autocomplete
                wrapperStyle={''}
                value={this.state.value}
                renderInput={(props) => (<input type="text"
                  class="form-control" {...props} />
                )}
                items={getStates()}
                getItemValue={(item) => item.name}
                shouldItemRender={matchStateToTerm}
                sortItems={sortStates}
                onChange={(event, value) => this.setState({ value })}
                onSelect={value => this.setState({ value })}
                renderMenu={children => (
                  <div className="w-100">
                    {children}
                  </div>
                )}
                renderItem={(item, isHighlighted) => (
                  <div
                    className={`w-100 font-weight-${isHighlighted ? 'bold' : 'normal'}`}
                    key={item.abbr}
                  >{item.name}</div>
                )}
              />

            </form>
          </div>
          <div className="card-footer">
            <button type="button" className="btn btn-primary" onClick={this.analyseFile}>Valider</button>
          </div>
        </div>
        {/* <p dangerouslySetInnerHTML={this.state.ocrResult.html}></p> */}
      </div>
    );
  }
}

export default App;
