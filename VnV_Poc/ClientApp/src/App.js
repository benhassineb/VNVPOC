import React, { Component } from "react";
import "./App.css";
import Autocomplete from 'react-autocomplete';
import { sortStates, getStates, matchStateToTerm } from "./utils";

export const months = [{ value: 1, label: 'Janvier' },
{ value: 2, label: 'Février' },
{ value: 3, label: 'Mars' },
{ value: 4, label: 'Avril' },
{ value: 5, label: 'Mai' },
{ value: 6, label: 'Juin' },
{ value: 7, label: 'Juillet' },
{ value: 8, label: 'Août' },
{ value: 9, label: 'Septembre' },
{ value: 10, label: 'Octobre' },
{ value: 11, label: 'Novembre' },
{ value: 12, label: 'Décembre' }]

class App extends Component {

  constructor(props) {
    super(props);
    this.state.months = months;
    this.state = {
      user: {
        firstName: '',
        lastName: '',
        adresse: '',
        invoiceDate: '',
        invoiceAmmount: ''
      }
    };

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


  handleChange = (el) => {
    let inputName = el.target.name;
    let inputValue = el.target.value;

    let statusCopy = Object.assign({}, this.state);
    statusCopy.user[inputName] = inputValue;

    this.setState(statusCopy);
  }

  handleSubmit = () => {
    console.log(this.state);
  }

  render() {
    let months = this.state.months;
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
                    name="firstName"
                    value={this.state.user.firstName}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="col">
                  <label> Prénom </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Prénom"
                    name="lastName"
                    value={this.state.user.lastName}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <label> Adresse </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Adresse"
                  name="adresse"
                  value={this.state.user.adresse}
                  onChange={this.handleChange} />
              </div>


              <div className="form-row">
                <div className="form-group col ">
                  <label htmlFor="inputState">Date</label>
                  <select id="inputState" className="form-control" name="invoiceDate" value={this.state.user.invoiceDate} onChange={this.handleChange}>
                    <option>Choisir ...</option>
                    {months && months.map(item => {
                      return <option key={item.value} value={item.value}>{item.label}</option>
                    })}

                  </select>
                </div>
                <div className="col">
                  <label> Montant </label>
                  <div className="input-group" >
                    <input type="text" className="form-control" aria-label="Dollar amount (with dot and two decimal places)"
                      value={this.state.user.invoiceAmmount}
                      name="invoiceAmmount"
                      onChange={this.handleChange} />
                    <div className="input-group-append">
                      <span className="input-group-text">$</span>
                    </div>
                  </div>
                </div>
              </div>


              {/* <Autocomplete
                wrapperStyle={null}
                value={this.state.user.adresse}
                renderInput={(props) => (<div className="form-row">
                  <label>Adresse</label>
                  <input type="text"
                    className="form-control"
                    name="adresse"
                    {...props}
                  />
                </div>
                )}
                items={getStates()}
                getItemValue={(item) => item.name}
                shouldItemRender={matchStateToTerm}
                sortItems={sortStates}
                onChange={(event, value) => this.setState({
                  user: {
                    ...this.state.user,
                    adresse: value
                  }
                })}
                onSelect={value => this.setState({
                  user: {
                    ...this.state.user,
                    adresse: value
                  }
                })}
                renderMenu={children => (
                  <div>
                    {children}
                  </div>
                )}
                renderItem={(item, isHighlighted) => (
                  <div
                    className={`w-100 font-weight-${isHighlighted ? 'bold' : 'normal'}`}
                    key={item.abbr}
                  >{item.name}</div>
                )}
              /> */}

              <div className="form-row">
                <label>Example file input</label>
                <input type="file" className="form-control-file"
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={this.onFilesAdded}
                />
              </div>
            </form>
          </div>
          <div className="card-footer">
            <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Valider</button>
          </div>
        </div>
        {/* <p dangerouslySetInnerHTML={this.state.ocrResult.html}></p> */}
      </div >
    );
  }
}

export default App;
