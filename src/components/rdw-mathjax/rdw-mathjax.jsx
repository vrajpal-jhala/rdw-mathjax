// Import Modules
import { useEffect, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';

// Import Components
import MathJaxOption from './mathjax_option';

// Import Miscs
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const RDWMathJax = ({ rawDraftContentState, onContentStateChange }) => {
  const [contentState, setContentState] = useState();

  // Will only execute when rawDraftContentState changes (ie. for default value)
  useEffect(() => {
    setContentState(rawDraftContentState);
  }, [setContentState, rawDraftContentState]);

  return (
    <Editor
      contentState={contentState}
      onContentStateChange={onContentStateChange}
      toolbarCustomButtons={[<MathJaxOption />]}
    />
  );
};

export default RDWMathJax;
