import React, { Component } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './ckeditor.css';

class CKApp extends Component {
  constructor (props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (html) {
    this.props.onChange(html);
  }

  render() {
    return (
      <div className="CKApp">
        <CKEditor
          editor={ ClassicEditor }
          data={this.props.editorHtml}
          onInit={ editor => {
            // You can store the "editor" and use when it is needed.
            console.log( 'Editor is ready to use!', editor );
          } }
          onChange={ ( event, editor ) => {
            const data = editor.getData();
            console.log( { event, editor, data } );
            this.handleChange(data);
          } }
          onBlur={ ( event, editor ) => {
            console.log( 'Blur.', editor );
          } }
          onFocus={ ( event, editor ) => {
            console.log( 'Focus.', editor );
          } }
        />

        { !this.props.synced &&
          <textarea 
            className="editor-output"
            value={ this.props.editorHtml } 
            onChange={ e => this.handleChange(e.target.value) }
            >
          </textarea>
        }
      </div>
    );
  }
}

export default CKApp;