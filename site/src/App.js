import React, { Component } from 'react';
import './App.css';
import Dropdown from './components/Dropdown';
import Table from './components/Table';
import Navbar from './components/NavBar';
import { Container, Row, Col } from 'reactstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Card, Button, CardTitle, CardText } from 'reactstrap';


class App extends Component {
    constructor(props) {
		super(props);
		this.state = {
		  loading: true,
		  error: null,
		  recipes: [],
		  current_recipe: '',
		  ingredients: [],
		  shopping_list_recipes: [],
		  shopping_list_data: [],
		  shopping_list_output: '',
		  copied: false
		};
		this.baseURL = "http://localhost:8080/";
		this.handleDropdown = this.handleDropdown.bind(this);
		this.handleAddToList = this.handleAddToList.bind(this);
	}

	handleDropdown(recipeName) {
	    fetch(this.baseURL + "recipe.json?name=" + encodeURIComponent(recipeName))
		  .then(res => res.json())
		  .then(
			(result) => {
              let ingredients = result[0].list;

              this.setState({
				ingredients,
				current_recipe: recipeName
			})},
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

	handleAddToList(event) {
	    if(this.state.current_recipe !== '') {
            function aggregateData(d) {
                if(temp.hasOwnProperty(d.ingredient.name)) {
                   temp[d.ingredient.name].quantity = temp[d.ingredient.name].quantity + d.quantity;
                } else {
                   temp[d.ingredient.name] = {unit: d.ingredient.unit, type: d.ingredient.type, quantity: d.quantity};
                }
            }

            let temp = {}, shopping_list_data = [];
            this.state.shopping_list_data.forEach(aggregateData);
            this.state.ingredients.forEach(aggregateData);
            for(var prop in temp) {
                shopping_list_data.push({ingredient: {name: prop, unit: temp[prop].unit, type: temp[prop].type},
                                         quantity: temp[prop].quantity});
            }
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

            shopping_list_data = shopping_list_data.sort(typeNameSort)

            let shopping_list_recipes = this.state.shopping_list_recipes;
            shopping_list_recipes.push(this.state.current_recipe);

            function humanizeOutput(row) {
                return row.quantity + ' x ' +
                       row.ingredient.name +
                       (row.ingredient.unit !== '' ? ' (' + row.ingredient.unit + ')' : '') +
                       '\n'
            }

            this.setState({
                shopping_list_recipes,
                shopping_list_data,
                shopping_list_output: shopping_list_data.map(humanizeOutput).join('')
            });
        }
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
                <Dropdown
                    items={recipes}
                    title='Recipes'
                    onDropdownChange={this.handleDropdown}/>
                </Col>
                <Col>
                <Button outline color="primary"
                    onClick={this.handleAddToList}>
                    Add to list
                </Button>
                </Col>

            </Row>
            <Row><br/></Row>
            <Row>
                <Col>
                    <h1>{current_recipe}</h1>
                    {table}
                </Col>
                <Col>
                  <Card body inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>
                    <CardTitle>Shopping List</CardTitle>
                    <CardText>
                    <CopyToClipboard
                        text={shopping_list_output}
                        onCopy={() => this.setState({copied: true})}>
                        <Button color="success">Copy</Button>
                    </CopyToClipboard><br/>
                    {shopping_list_recipes.map((item, key) => {
                          return <span key={key}><strong>{item}</strong><br/></span>})}
                    {shopping_list_output.split('\n').map((item, key) => {
                          return <span key={key}>{item}<br/></span>})}
                    </CardText>
                  </Card>
                </Col>
            </Row>
        </Container>
      </div>
    );
  }
}

export default App;
