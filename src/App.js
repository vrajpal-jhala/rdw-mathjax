// Import Modules
import { useEffect, useRef, useState } from 'react';
import draftToHtml from 'draftjs-to-html';
import ReactHTMLParser from 'react-html-parser';

// Import Components
import RDWMathJax from './components/rdw-mathjax/rdw-mathjax';
import { content } from './configs';

// Import Miscs
import './App.css';

function App() {
  const node = useRef();
  const [rawDraftContentState, setRawDraftContentState] = useState(null);
  const [json, setJSON] = useState('');

  useEffect(() => {
    // Some async task (ie. getting editor data from DB)
    setTimeout(() => {
      setRawDraftContentState(content);
      setJSON(JSON.stringify(content));
    }, 1000);
  }, []);

  useEffect(() => {
    window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, node.current]);
  });

  const onContentStateChange = (rawDraftContentState) => {
    setJSON(JSON.stringify(rawDraftContentState));
  }

  return (
    <div className="container">
      <h1>React-Draft-WYSIWYG with MathJax</h1>
      <RDWMathJax rawDraftContentState={rawDraftContentState} onContentStateChange={onContentStateChange} />
      <div className="preview-container">
        <h2>Preview</h2>
        <hr />
        <div className="preview">
          <div ref={node} key={Math.random()}>
            {json && ReactHTMLParser(draftToHtml(JSON.parse(json)))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
