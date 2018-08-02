import React, { Component } from 'react';
import './App.css';
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

class List extends Component {
    constructor(props) {
		super(props);
		this.state = {
		  loading: true,
		  error: null,
		  recipes: [],
		  ingredients: [],
		  shopping_list_recipes: [],
		  shopping_list_data: [],
		  shopping_list_output: '',
		  copied: false
		};
		this.baseURL = "http://localhost:8080/";
		this.handleButtonClick = this.handleButtonClick.bind(this);
	}

	handleButtonClick(recipeName) {
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
                    ingredients
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
    const { loading, error, recipes, ingredients, shopping_list_output, shopping_list_recipes, current_recipe, procedure } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    }
    else if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <Navbar brand='lyst' links={[['List', '/list'], ['Add', '/add'], ['Cook', '/cook']]}/ >
        <Container>
            <Row><br/></Row>
            <Row>
                <Col>
                    <ButtonGroup vertical>
                      {recipes.map((recipe) => {
                        return <Button outline color="primary" onClick={() => this.handleButtonClick(recipe)} active={this.state.shopping_list_recipes.includes(recipe)}>{recipe}</Button>
                      })}
                    </ButtonGroup>
                </Col>
                <Col>
                    <CopyToClipboard
                        text={shopping_list_output}
                        onCopy={() => this.setState({copied: true})}>
                        <Button color="secondary">Copy List</Button>
                    </CopyToClipboard>
                    <br/><br/>

                  <Card body outline color="secondary">
                    <CardTitle>Shopping List</CardTitle>
                    <CardText>
                    {shopping_list_output.split('\n').map((item, key) => {
                          return <span key={key}>{item}<br/></span>})}
                    </CardText>
                  </Card>
                </Col>
                <Col>
                    <CopyToClipboard
                        text={shopping_list_recipes.join('\n')}
                        onCopy={() => this.setState({copied: true})}>
                        <Button color="warning">Copy Menu</Button>
                    </CopyToClipboard>
                    <br/><br/>

                  <Card body outline color="warning">
                    <CardTitle>Menu</CardTitle>
                    <CardText>
                    {shopping_list_recipes.map((item, key) => {
                          return <span key={key}><strong>{item}</strong><br/></span>})}
                    <br/>
                    </CardText>
                  </Card>
                </Col>
            </Row>
        </Container>
      </div>
    );
  }
}

export default List;
