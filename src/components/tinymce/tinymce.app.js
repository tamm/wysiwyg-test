import React, { Component } from 'react';
import tinymce from 'tinymce/tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/link';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/image';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/print';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/anchor';

import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/media';
import 'tinymce/plugins/table';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/code';
import 'tinymce/plugins/help';
import 'tinymce/plugins/wordcount';

import { Editor } from '@tinymce/tinymce-react';

class TinyApp extends Component {
  constructor (props) {
    super(props)
    this.state = { theme: 'snow' }
    this.handleEditorChange = this.handleEditorChange.bind(this);
  }

  handleEditorChange = (content, editor) => {
    this.props.onChange(content);
  }

  render() {
    return (
      <div className="TinyMCE">
        <Editor
          value={this.props.editorHtml}
          init={{
            height: 500,
            menubar: false,
            branding: false,
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount'
            ],
            toolbar:
              `undo redo | formatselect | bold italic backcolor | \
              alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent | removeformat | help`
          }}
          onEditorChange={this.handleEditorChange}
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

export default TinyApp;