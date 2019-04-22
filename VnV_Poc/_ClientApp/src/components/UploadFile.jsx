import React, { Component } from 'react'

export class UploadFile extends Component {
    constructor(props) {
        super(props);
        this.state = { ocrResult: { text: '', html: { __html: '' } } };
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
            <div>



                <form>
                    <div className="form-group">
                        <label  >Example file input</label>
                        <input type="file" className="form-control-file"
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={this.onFilesAdded}
                        />
                    </div>
                    <p dangerouslySetInnerHTML={this.state.ocrResult.html}></p>
                </form>

            </div>
        )
    }
}
