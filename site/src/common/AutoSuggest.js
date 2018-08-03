import React from 'react';
import { Form, Text, Field, withFormApi } from 'informed';
import Autosuggest from 'react-autosuggest';


// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div>
    {suggestion}
  </div>
);

const Message = ({ color, message }) => (
<div className="mb-4" style={{ color }}>
  <small>{message}</small>
</div>
)

const validate = value => ({
    error: !value || !/Hello World/.test(value) ? "Input must contain 'Hello World'" : null,
    warning: !value || !/^Hello World$/.test(value) ? "Input should equal just 'Hello World'" : null,
    success: value && /Hello World/.test(value) ? "Thanks for entering 'Hello World'!" : null
})

export default class AutoSuggest extends React.Component {
    constructor( props ) {
      super( props );
      this.state = {
        suggestions: [],
        value: ''
      };
    }

   static defaultProps = {
    // Takes a list of links values and turns them into NavItems
      inputList: ['test', 'grok', 'flop']
   };


    // Teach Autosuggest how to calculate suggestions for any given input value.
    getSuggestions(value, inputList) {
      const inputValue = value.trim().toLowerCase();
      const inputLength = inputValue.length;

      return inputLength === 0 ? [] : inputList.filter(b =>{
       return b.toLowerCase().indexOf(inputValue) !== -1
       }
      );
    };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value, this.props.inputList)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

    render() {
    // Use the form field and your custom input together to create your very own input!
    return <Field validate={validate} field={this.props.field}>
      { fieldApi => {

        // Remember to pull off everything you dont want ending up on the <input>
        // thats why we pull off onChange, onBlur, and field
        // Note, the ...rest is important because it allows you to pass any
        // additional fields to the internal <input>.
        const { suggestions } = this.state
        const { onChange, onBlur, field, placeholder, ...rest } = this.props;

        const { value, error, warning, success, setValue, setTouched } = fieldApi;

        // When suggestion is clicked, Autosuggest needs to populate the input
        // based on the clicked suggestion. Teach Autosuggest how to calculate the
        // input value for every given suggestion.
        const getSuggestionValue = suggestion => {
            setValue(suggestion);
            return suggestion;
        }

        // Autosuggest will pass through all these props to the input.
        const inputProps = {
          placeholder: placeholder,
          value: (value || ''),
          onChange: (e, { newValue }) => {
                setValue(newValue)

                if (onChange) {
                  onChange(newValue, e)
                }
              },
          field: 'test',
          id: 'test'
        };

        return (
          <div>
            <Autosuggest
                {...rest}
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
              />

            {error ? <Message color="red" message={error} /> : null}
            {!error && warning ? <Message color="orange" message={warning} /> : null}
            {!error && !warning && success ? <Message color="green" message={success} /> : null}
          </div>
        )
      }
    }
    </Field>
    }
}


