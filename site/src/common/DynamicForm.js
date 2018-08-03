import React from 'react';
import { Form, Text } from 'informed';
import AutoSuggest from './AutoSuggest';

const numValidate = value => ({
  error: typeof value !== 'number' ? "Input must be numeric" : null,
  success: typeof value === 'number' ? "Yay a number!" : null
});


export default class DynamicForm extends React.Component {
    constructor( props ) {
      super( props );

    }

    render() {
      return (
        <div>
          <Form
            onSubmit={submittedValues => {console.log(submittedValues);return this.setState( { submittedValues } )}}>
            { formApi => (
              <div>
                <form onSubmit={formApi.submitForm} id="dynamic-form">
                  <button type="submit" className="mb-4 btn btn-primary">Submit</button><br/>
                  <label htmlFor="dynamic-first">Recipe</label>
                  <AutoSuggest
                    field='recipe'
                    id='recipe'
                    placeholder='Recipe'
                    inputList={this.props.inputList} />
                </form>
              </div>
            )}
          </Form>
        </div>
      );
    }
}


//                <button
//                  onClick={() => formApi.addValue('ingredients', '')}
//                  type="button"
//                  className="mb-4 mr-4 btn btn-success">Add Ingredient</button>
//
//                  { formApi.values.ingredients && formApi.values.ingredients.map(
//                   (ingredient, i) => (
//                        <div key={'ingredient' + i}>
//                          <Text
//                            field={["quantity", i]}
//                            id={`ingredient-quantity-${i}`}
//                            validate={numValidate} />
//                          <AutoSuggest
//                            field={['ingredient', i]}
//                            id={`ingredient-name-${i}`}
//                            placeholder={'Ingredient ' + i}
//                            inputList={this.props.inputList} />
//                          <button
//                            onClick={() => formApi.removeValue('ingredient', i)}
//                            type="button"
//                            className="mb-4 btn btn-danger">-</button>
//                        </div>
//                    )
//
//                  )}