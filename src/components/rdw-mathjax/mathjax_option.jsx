// Import Modules
import { Component, createRef } from 'react';
import { EditorState, Modifier } from 'draft-js';

// Import Miscs
import { MathJaxSymbols } from '../../configs';
import MathJaxIcon from '../../images/math_jax.png';

// Referenced from example :- https://jpuri.github.io/react-draft-wysiwyg/#/docs (Adding new option to the toolbar)
class MathJaxOption extends Component {
  constructor(props) {
    const { modalHandler } = props;

    super(props);

    this.mathJaxOptions = [
      'Greek letters', 'Unary operators', 'Relation operators',
      'Binary operators', 'Negated binary relations', 'Set and/or logic notation',
      'Geometry', 'Delimiters', 'Arrows', 'Other symbols', 'Trigonometric functions'
    ];

    this.mathJaxSymbols = MathJaxSymbols;

    this.expanded = {};
    this.mathJaxOptions.forEach((option) => this.expanded[option] = false);

    this.state = {
      expanded: null,
      load: false,
    };

    this.mathJaxToolbarRef = createRef();
    modalHandler.registerCallBack(this.expandCollapse);
  }

  componentWillUnmount() {
    const { modalHandler } = this.props;
    modalHandler.deregisterCallBack(this.expandCollapse);
  }

  onIconClickEvent = () => {
    const { load } = this.state;

    this.setState({
      load: !load,
    });

    if (!load) {
      // load symbols when toolbar is visible, instead of initial load
      setTimeout(() => window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, this.mathJaxToolbarRef.current]));
    }
  }

  addSymbol = (syntax) => {
    const { editorState, onChange } = this.props;

    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      syntax,
      editorState.getCurrentInlineStyle(),
    );

    onChange(EditorState.push(editorState, contentState, 'insert-characters'));
  };

  onExpandEvent = (_event, option) => {
    const { expanded } = this.state;

    this.signalExpanded = {
      ...this.expanded,
      [option]: expanded ? !expanded[option] : true,
    };

    this.clickedOption = option;
  };

  expandCollapse = () => {
    this.setState({
      expanded: this.signalExpanded,
    });

    this.signalExpanded = {
      ...this.signalExpanded,
      [this.clickedOption]: false,
    };
  };

  stopPropagation = (event) => {
    event.stopPropagation();
  };

  render() {
    const { expanded, load } = this.state;

    return (
      <>
        <div className="mathjax-icon" onClick={this.onIconClickEvent}>
          <div className="rdw-option-wrapper">
            <img src={MathJaxIcon} alt="MathJax" />
          </div>
        </div>
        <div ref={this.mathJaxToolbarRef} className="mathjax-toolbar">
        {load && (
          <>
            <hr />
            <div className="mathjax-toolbar-heading">
              <b>MathJax:</b>
              <div>
                <div className="rdw-option-wrapper" onClick={() => this.addSymbol('$')}>Start/End inline Equation</div>
                <div className="rdw-option-wrapper" onClick={() => this.addSymbol('$$')}>Start/End Block Equation</div>
              </div>
            </div>
            <div className="mathjax-option-container">
              {this.mathJaxOptions.map((option, index) => (
                <div key={option} className="rdw-dropdown-wrapper" onClick={(event) => this.onExpandEvent(event, option)}>
                  <span>{option}</span>
                  <div className={`rdw-dropdown-caretto${expanded && expanded[option] ? 'close' : 'open'}`} />
                  {/* Have to keep it in DOM instead of conditional render, otherwise will have to load symbols on expand, which takes time */}
                  <div className={`rdw-dropdown-optionwrapper${expanded && expanded[option] ? '' : ' d-none'}`} onClick={this.stopPropagation}>
                    {this.mathJaxSymbols[index].map(({label, syntax}) => (
                      <div key={label} className="symbol" onClick={() => this.addSymbol(syntax)}>
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        </div>
      </>
    );
  }
}

export default MathJaxOption;
