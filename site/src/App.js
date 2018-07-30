import React, { Component } from 'react';
import './App.css';
import Dropdown from './components/Dropdown';
import Table from './components/Table';
import Navbar from './components/NavBar';
import { Container, Row, Col } from 'reactstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Card, Button, ButtonGroup, CardTitle, CardText } from 'reactstrap';

function typeNameSort(a, b) {
    if (a.ingredient.type < b.ingredient.type) {
        return -1
    }
    if (a.ingredient.type > b.ingredient.type) {
        return +1
    }
    if (a.ingredient.name < b.ingredient.name) {
        return -1;
    }
    if (a.ingredient.name > b.ingredient.name) {
        return +1;
    }
    return 0;
}

function humanizeOutput(row) {
    return row.quantity + ' x ' +
           row.ingredient.name +
           (row.ingredient.unit !== '' ? ' (' + row.ingredient.unit + ')' : '') +
           '\n'
}

class App extends Component {
    constructor(props) {
		super(props);
		this.state = {
		  loading: true,
		  error: null,
		  recipes: [],
		  ingredients: [],
		  current_recipe: '',
		  shopping_list_recipes: [],
		  shopping_list_data: [],
		  shopping_list_output: '',
		  copied: false
		};
		this.baseURL = "http://localhost:8080/";
		this.handleDropdown = this.handleDropdown.bind(this);
	}

	handleDropdown(recipeName) {
	    fetch(this.baseURL + "recipe.json?name=" + encodeURIComponent(recipeName))
		  .then(res => res.json())
		  .then(
			(result) => {
              let ingredients = result[0].list;

                // Aggregate all ingredients into a single list
                const { shopping_list_recipes } = this.state;
                let temp = {}, shopping_list_data = [];
                function aggAddData(d, type) {
                    if(temp.hasOwnProperty(d.ingredient.name)) {
                       temp[d.ingredient.name].quantity += d.quantity;
                    } else {
                       temp[d.ingredient.name] = {unit: d.ingredient.unit, type: d.ingredient.type, quantity: d.quantity};
                    }
                }
                function aggSubtractData(d, type) {
                    if(temp.hasOwnProperty(d.ingredient.name)) {
                       temp[d.ingredient.name].quantity -= d.quantity;
                    } else {
                       temp[d.ingredient.name] = {unit: d.ingredient.unit, type: d.ingredient.type, quantity: d.quantity};
                    }
                }
                this.state.shopping_list_data.forEach(aggAddData);

                let ind = this.state.shopping_list_recipes.indexOf(recipeName)
                if (ind === -1) {
                    ingredients.forEach(aggAddData);
                    shopping_list_recipes.push(recipeName);
                } else {
                    ingredients.forEach(aggSubtractData);
                    shopping_list_recipes.splice(ind, 1);
                }

                for(var prop in temp) {
                    shopping_list_data.push({ingredient: {name: prop, unit: temp[prop].unit, type: temp[prop].type},
                                             quantity: temp[prop].quantity});
                }
                // Sort list based on Type then Name
                shopping_list_data = shopping_list_data.sort(typeNameSort).filter(item => item.quantity !== 0)

                this.setState({
                    shopping_list_recipes,
                    shopping_list_data,
                    shopping_list_output: shopping_list_data.map(humanizeOutput).join(''),
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
    const { loading, error, recipes, ingredients, shopping_list_output, shopping_list_recipes, current_recipe } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    }
    else if (loading) {
      return <div>Loading...</div>;
    }

    let table;
    if (ingredients) {
        table =  <Table
            header={['Quantity','Name','Unit']}
            rows={ingredients.map((i) =>
                            [i.quantity,
                             i.ingredient.name,
                             i.ingredient.unit])} />;
    } else {
        table = '';
    }

    return (
      <div>
        <Navbar brand='lyst' links={[]}/ >
        <Container>
            <Row><br/></Row>
            <Row>
                <Col>
                    <CopyToClipboard
                        text={shopping_list_recipes.join('\n') + '\n' + shopping_list_output}
                        onCopy={() => this.setState({copied: true})}>
                        <Button color="success">Copy</Button>
                    </CopyToClipboard>
                    <br/><br/>

                    <ButtonGroup vertical>
                      {recipes.map((recipe) => {
                        return <Button color="primary" onClick={() => this.handleDropdown(recipe)} active={this.state.shopping_list_recipes.includes(recipe)}>{recipe}</Button>
                      })}
                    </ButtonGroup>
                </Col>
                <Col>
                  <Card body outline color="secondary">
                    <CardTitle>Shopping List</CardTitle>
                    <CardText>
                    {shopping_list_recipes.map((item, key) => {
                          return <span key={key}><strong>{item}</strong><br/></span>})}
                    {shopping_list_output.split('\n').map((item, key) => {
                          return <span key={key}>{item}<br/></span>})}
                    </CardText>
                  </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <br/>
                    <h1>{current_recipe}</h1>
                    {table}
                </Col>
            </Row>
        </Container>
      </div>
    );
  }
}

export default App;
