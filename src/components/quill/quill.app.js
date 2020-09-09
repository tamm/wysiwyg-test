import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import PropTypes from 'prop-types';
import './quill.css';
import 'quill-giphy';
import 'quill-emoji';
import 'quill-emoji/dist/quill-emoji.css';

class Editor extends Component {
  constructor (props) {
    super(props)
    this.state = { theme: 'snow' }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (html) {
    this.props.onChange(html);
  }

  handleThemeChange (newTheme) {
    if (newTheme === "core") newTheme = null;
    this.setState({ theme: newTheme })
  }

  render () {
    return (
      <div className="Quill">
        <ReactQuill 
          theme={this.state.theme}
          onChange={this.handleChange}
          value={this.props.editorHtml}
          modules={Editor.modules}
          formats={Editor.formats}
          bounds={'.Quill'}
          placeholder={this.props.placeholder}
          />

        <div className="themeSwitcher">
          <label>Theme </label>
          <select onChange={(e) => 
        this.handleThemeChange(e.target.value)}>
            <option value="snow">Snow</option>
            <option value="bubble">Bubble</option>
            <option value="core">Core</option>
          </select>
        </div>

        { !this.props.synced &&
          <textarea 
            className="editor-output"
            value={ this.props.editorHtml } 
            onChange={ e => this.handleChange(e.target.value) }
            >
          </textarea>
        }
      </div>
    )
  }
}

/* 
    * Quill modules to attach to editor
    * See https://quilljs.com/docs/modules/ for complete options
    */
Editor.modules = {
  toolbar: {
    container: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'align': [] }],

      ['link'],
      ['emoji'],
      ['giphy'],

      ['clean']                                         // remove formatting button
    ],
    handlers: {
      'emoji': function() {},
      'giphy': function() {}
    }
  },
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: true,
  },
  "giphy": true,
  "emoji-toolbar": true,
  "emoji-textarea": true,
  "emoji-shortname": true,
  // divider: true,
}
/* 
    * Quill editor formats
    * See https://quilljs.com/docs/formats/
    */
Editor.formats = null

/* 
  * PropType validation
  */
Editor.propTypes = {
  placeholder: PropTypes.string,
}

export default Editor;