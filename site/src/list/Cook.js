import React, { Component } from 'react';
import './List.css';
import Dropdown from '../common/Dropdown';
import Table from '../common/Table';
import Navbar from '../common/NavBar';
import { Container, Row, Col } from 'reactstrap';

function humanizeOutput(row) {
    return [row.quantity + ' x ' +
           row.ingredient.name +
           (row.ingredient.unit !== '' ? ' (' + row.ingredient.unit + ')' : '')]
}

class Cook extends Component {
    constructor(props) {
		super(props);
		this.state = {
		  loading: true,
		  error: null,
		  recipes: [],
		  ingredients: [],
		  current_recipe: '',
		  procedure: []
		};
		this.baseURL = "http://localhost:8080/";
		this.onDropdownChange = this.onDropdownChange.bind(this);
	}

	onDropdownChange(recipeName) {
	    fetch(this.baseURL + "recipe.json?name=" + encodeURIComponent(recipeName))
		  .then(res => res.json())
		  .then(
			(result) => {
              let ingredients = result[0].list;

                console.log(ingredients.map(humanizeOutput))
                this.setState({
                    ingredients,
                    current_recipe: recipeName
                });
              },
			// Note: it's important to handle errors here
			// instead of a catch() block so that we don't swallow
			// exceptions from actual bugs in components.
			(error) => {
			  this.setState({
				error
			  });
			}
		  )

		fetch(this.baseURL + "procedure.json?recipe=" + encodeURIComponent(recipeName))
		  .then(res => res.json())
		  .then(
			(result) => {
              let procedure = result;

                this.setState({
                    procedure
                });
              },
			// Note: it's important to handle errors here
			// instead of a catch() block so that we don't swallow
			// exceptions from actual bugs in components.
			(error) => {
			  this.setState({
				error
			  });
			}
		  )
	}

    componentDidMount() {
        this.setState({
			loading: true
		});

		fetch(this.baseURL + "recipe.json")
		  .then(res => res.json())
		  .then(
			(result) => {
              let recipes = result.map((item) => item.name);
			  this.setState({
				recipes: recipes,
				loading: false
			  });
			},
			// Note: it's important to handle errors here
			// instead of a catch() block so that we don't swallow
			// exceptions from actual bugs in components.
			(error) => {
			  this.setState({
				error
			  });
			}
		  )
	  }

  render() {
    const { loading, error, recipes, ingredients, current_recipe, procedure } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    }
    else if (loading) {
      return <div>Loading...</div>;
    }

    let ingredient_table, procedure_table;
    if (ingredients) {
        ingredient_table =  <Table
            header={['Ingredients']}
            rows={ingredients.map(humanizeOutput)} />;
    } else {
        ingredient_table = '';
    }

    if (procedure) {
        procedure_table =  <Table
            header={['#','Step']}
            rows={procedure.map((i) =>
                            [i.step_id,
                             i.step_details])} />;
    } else {
        procedure_table = '';
    }

    return (
      <div>
        <Navbar brand='lyst' links={[['List', '/list'], ['Add', '/add'], ['Cook', '/cook']]}/ >
        <Container>
            <Row>
                <Col>
                    <br/>
                    <Dropdown title={'Recipes'}
                              items={recipes}
                              onDropdownChange={this.onDropdownChange}/>
                    <br/>
                </Col>
            </Row>
            <Row>
            <h1>{current_recipe}</h1>
            </Row>
            <Row>
                <Col className='col-3'>
                    {ingredient_table}
                </Col>
                <Col className='col-9'>
                    {procedure_table}
                </Col>
            </Row>
        </Container>
      </div>
    );
  }
}

export default Cook;
