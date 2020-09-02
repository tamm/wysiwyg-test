import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import CKApp from './components/ckeditor/ckeditor.app.js';
import TinyApp from './components/tinymce/tinymce.app.js';
import Quill from './components/quill/quill.app.js';
import { Button, ToolbarContent, ToolbarDivider, ToolbarSubtitle, ToolbarTitle, Toolbar } from '@squiz/mercury-sds-react';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function App() {
  const [tab, setTab] = useState("All");
  const [sync, setSync] = useState(true);
  const [editorHtmlShared, setEditorHtmlShared] = useState("");
  const [editorHtmlCKApp, setEditorHtmlCKApp] = useState("");
  const [editorHtmlTinyApp, setEditorHtmlTinyApp] = useState("");
  const [editorHtmlQuill, setEditorHtmlQuill] = useState("");
  const prevEditorHtmlCKApp = usePrevious(editorHtmlCKApp);
  const prevEditorHtmlTinyApp = usePrevious(editorHtmlTinyApp);
  const prevEditorHtmlQuill = usePrevious(editorHtmlQuill);
  const prevEditorHtmlShared = usePrevious(editorHtmlShared);

  useEffect(() => {
    console.log('editorHtmlCKApp:', editorHtmlCKApp);
    if(sync && prevEditorHtmlCKApp != editorHtmlCKApp) {
      setEditorHtmlShared(editorHtmlCKApp);
      setEditorHtmlTinyApp(editorHtmlCKApp);
      setEditorHtmlQuill(editorHtmlCKApp);
    }
  }, [editorHtmlCKApp, sync]);

  useEffect(() => {
    console.log('editorHtmlTinyApp:', editorHtmlTinyApp);
    if(sync && prevEditorHtmlTinyApp != editorHtmlTinyApp) {
      setEditorHtmlShared(editorHtmlTinyApp);
      setEditorHtmlCKApp(editorHtmlTinyApp);
      setEditorHtmlQuill(editorHtmlTinyApp);
    }
  }, [editorHtmlTinyApp, sync]);

  useEffect(() => {
    console.log('editorHtmlQuill:', editorHtmlQuill);
    if(sync && prevEditorHtmlQuill != editorHtmlQuill) {
      setEditorHtmlShared(editorHtmlQuill);
      setEditorHtmlCKApp(editorHtmlQuill);
      setEditorHtmlTinyApp(editorHtmlQuill);
    }
  }, [editorHtmlQuill, sync]);

  useEffect(() => {
    console.log('editorHtmlShared:', editorHtmlShared);
    if(sync && prevEditorHtmlShared != editorHtmlShared) {
      setEditorHtmlCKApp(editorHtmlShared);
      setEditorHtmlTinyApp(editorHtmlShared);
      setEditorHtmlQuill(editorHtmlShared);
    }
  }, [editorHtmlShared, sync]);

  return (
    <div className="App">
      <Toolbar color="default">
        <ToolbarContent>
          <ToolbarTitle>Squiz</ToolbarTitle>
          <ToolbarDivider />
          <ToolbarSubtitle>WYSIWYG Test</ToolbarSubtitle>
        </ToolbarContent>
    
        <ToolbarContent className="toolbar-right">
          <Button className={'toolbar-button ' + (tab === "All" && 'active')} onClick={() => setTab("All")}>
            All
          </Button>
          <Button className={'toolbar-button ' + (tab === "CKApp" && 'active')} onClick={() => setTab("CKApp")}>
            CK Editor 5
          </Button>
          <Button className={'toolbar-button ' + (tab === "TinyApp" && 'active')} onClick={() => setTab("TinyApp")}>
            Tiny MCE
          </Button>
          <Button className={'toolbar-button ' + (tab === "Quill" && 'active')} onClick={() => setTab("Quill")}>
            Quill
          </Button>
        </ToolbarContent>
      </Toolbar>


      <div className="editors">
      { (tab === "All" || tab === "CKApp") &&
        <CKApp synced={sync} editorHtml={editorHtmlCKApp} onChange={setEditorHtmlCKApp} />
      }
      { (tab === "All" || tab === "TinyApp") &&
        <TinyApp synced={sync} editorHtml={editorHtmlTinyApp} onChange={setEditorHtmlTinyApp} />
      }
      { (tab === "All" || tab === "Quill") &&
        <Quill synced={sync} editorHtml={editorHtmlQuill} onChange={setEditorHtmlQuill} />
      }
      </div>

      <FormControlLabel
          control={<Switch
            checked={sync}
            onChange={ event => setSync(event.target.checked) }
            name="sync-editors"
            inputProps={{ 'aria-label': 'Sync all editors' }}
          />}
          label="Sync all editors"
        />

      { sync && 
      <div className="editors"><div>
        <textarea 
          className="editor-output"
          value={ editorHtmlShared } 
          onChange={ event => setEditorHtmlShared(event.target.value) }
          >
        </textarea>
      </div></div>}
    </div>
  );
}

export default App;
