import React, { Component } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './ckeditor.css';

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';

import Giphy from 'ckeditor5-giphy';

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
          config={ {
            plugins: [ Essentials, Paragraph, Bold, Italic, Heading, Giphy, Image ],
            toolbar: [ 'heading', '|', 'bold', 'italic', '|', 'undo', 'redo', 'giphy']
          } }
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