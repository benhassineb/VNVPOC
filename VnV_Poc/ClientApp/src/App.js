import React, { Component } from "react";
import "./App.css";
import Autocomplete from "react-autocomplete";
import { sortStates, getStates, matchStateToTerm } from "./utils";
import { OcrResult } from "./OcrResult";
import Fuse from "fuse.js";
import { UploadFiles } from "./UploadFiles";
import { configuration } from "./configuartion";

export const months = [
  { value: 1, label: "Janvier" },
  { value: 2, label: "Février" },
  { value: 3, label: "Mars" },
  { value: 4, label: "Avril" },
  { value: 5, label: "Mai" },
  { value: 6, label: "Juin" },
  { value: 7, label: "Juillet" },
  { value: 8, label: "Août" },
  { value: 9, label: "Septembre" },
  { value: 10, label: "Octobre" },
  { value: 11, label: "Novembre" },
  { value: 12, label: "Décembre" }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      months: months,
      user: {
        firstName: "",
        lastName: "",
        adresse: "",
        invoiceDate: "",
        invoiceAmmount: ""
      },
      images: [],
      ocrResult: new OcrResult(''),
      isLoading: false
    };
  }
  handleOnChangeFiles = (file) => {
    let images = this.state.images;
    images = images.concat(file);
    this.setState({ images: images }, () => {
      this.state.images.forEach(image => this.analyseFile(image));
    });
  }



  analyseFile = file => {
    this.setState({ isLoading: true });
    let formData = new FormData();
    formData.append("file", file.blob);
    fetch(configuration.api + "AnalyseFile", {
      method: "PUT",
      body: formData
    })
      .then(response => response.json())
      .catch(error => console.error("Error:", error))
      .then(response => {
        let res = OcrResult.fromObject(response);
        let test = this.fuzzySearch(res.words, "BOUBAKER");
        this.setState({ isLoading: false, ocrResult: res });
      });
  };

  handleChange = el => {
    let inputName = el.target.name;
    let inputValue = el.target.value;

    let statusCopy = Object.assign({}, this.state);
    statusCopy.user[inputName] = inputValue;

    this.setState(statusCopy);
  };

  handleSubmit = () => {
    console.log(this.state);
  };

  fuzzySearch = (lines, keyword) => {
    let sourceText = lines.map(line => {
      return { text: line };
    });
    let options = {
      keys: ["text"],
      shouldSort: true,
      findAllMatches: true,
      threshold: 0.1,
      includeScore: true,
      includeMatches: true
    };
    let fuse = new Fuse(sourceText, options);
    return fuse.search(keyword);
  };


  render() {
    let months = this.state.months;
    let accept = ['image/*', '.pdf'];
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
                  onChange={this.handleChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group col ">
                  <label htmlFor="inputState">Date</label>
                  <select
                    id="inputState"
                    className="form-control"
                    name="invoiceDate"
                    value={this.state.user.invoiceDate}
                    onChange={this.handleChange}
                  >
                    <option>Choisir ...</option>
                    {months &&
                      months.map(item => {
                        return (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="col">
                  <label> Montant </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      aria-label="Dollar amount (with dot and two decimal places)"
                      value={this.state.user.invoiceAmmount}
                      name="invoiceAmmount"
                      onChange={this.handleChange}
                    />
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
                <label>Charger des fichiers</label>

                <UploadFiles
                  handleOnChange={this.handleOnChangeFiles}
                  multiple={false}
                  capture={true}
                  accept={accept}
                />

              </div>
            </form>
          </div>
          <div className="card-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.handleSubmit}
            >
              Valider
            </button>
          </div>
        </div>

        <div className="card my-3">
          <div className="card-header">Document </div>
          <div className="card-body">
            <div className="row">
              <div className="col">
                {this.state.images.map((img) => {
                  return <img key={img.id} className="img-fluid" src={img.url} />
                })}
              </div>
              <div className="col">
                {this.state.isLoading && (
                  <h1 className="text-center">
                    <i className="fas fa-spinner fa-spin" />
                  </h1>
                )}
                {this.state.ocrResult.lines &&
                  this.state.ocrResult.lines.map(word => {
                    return <p key={word}>{word}</p>;
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
