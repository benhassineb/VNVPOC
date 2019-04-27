import React, { Component } from "react";
import { File } from "./OcrResult";

export class UploadFiles extends Component {
  constructor(props) {
    super(props);
  }

  handleOnChange = evt => {
    let files = [];
    Array.from(evt.target.files).forEach(blob => {
      files.push(File.fromObject({ blob: blob }));
      this.props.handleOnChange(files);
    });
  };

  render() {
    return (
      <input
        className="form-control-file"
        type="file"
        accept={this.props.accept.join(",")}
        multiple={this.props.multiple}
        capture={this.props.capture}
        onChange={this.handleOnChange}
      />
    );
  }
}
