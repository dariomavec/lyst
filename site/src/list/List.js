import React, { Component } from 'react';
import './List.css';
import Navbar from '../common/NavBar';
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

function humanizeIngredients(row) {
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
		  shoppingList: {
		    data: [],
		    recipes: [],
		    ingredients: []
		  },
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
                const { shoppingList } = this.state;
                let aggStore = {}, shoppingData = [];
                function aggAddData(d, type) {
                    if(aggStore.hasOwnProperty(d.ingredient.name)) {
                       aggStore[d.ingredient.name].quantity += d.quantity;
                    } else {
                       aggStore[d.ingredient.name] = {unit: d.ingredient.unit, type: d.ingredient.type, quantity: d.quantity};
                    }
                }
                function aggSubtractData(d, type) {
                    if(aggStore.hasOwnProperty(d.ingredient.name)) {
                       aggStore[d.ingredient.name].quantity -= d.quantity;
                    } else {
                       aggStore[d.ingredient.name] = {unit: d.ingredient.unit, type: d.ingredient.type, quantity: d.quantity};
                    }
                }
                shoppingList.data.forEach(aggAddData);

                let ind = shoppingList.recipes.indexOf(recipeName);
                if (ind === -1) {
                    ingredients.forEach(aggAddData);
                    shoppingList.recipes.push(recipeName);
                } else {
                    ingredients.forEach(aggSubtractData);
                    shoppingList.recipes.splice(ind, 1);
                }

                for(var prop in aggStore) {
                    shoppingData.push({ingredient: {name: prop, unit: aggStore[prop].unit, type: aggStore[prop].type},
                                             quantity: aggStore[prop].quantity});
                }
                // Sort list based on Type then Name
                shoppingData = shoppingData.sort(typeNameSort).filter(item => item.quantity !== 0)

                this.setState({
                    shoppingList: {
                        data: shoppingData,
                        recipes: shoppingList.recipes,
                        ingredients: shoppingData.map(humanizeIngredients)
                    }
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
    const { loading, error, recipes, shoppingList } = this.state;

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
                        return <Button
                                    outline
                                    color="primary"
                                    onClick={() => this.handleButtonClick(recipe)}
                                    active={shoppingList.recipes.includes(recipe)}>
                                    {recipe}
                               </Button>
                      })}
                    </ButtonGroup>
                </Col>
                <Col>
                    <CopyToClipboard
                        text={shoppingList.ingredients.join('\n')}
                        onCopy={() => this.setState({copied: true})}>
                        <Button color="secondary">Copy List</Button>
                    </CopyToClipboard>
                    <br/><br/>

                  <Card body outline color="secondary">
                    <CardTitle>Shopping List</CardTitle>
                    <CardText>
                    {shoppingList.ingredients.map((item, key) => {
                          return <span key={key}>{item}<br/></span>})}
                    </CardText>
                  </Card>
                </Col>
                <Col>
                    <CopyToClipboard
                        text={shoppingList.recipes.join('\n')}
                        onCopy={() => this.setState({copied: true})}>
                        <Button color="warning">Copy Menu</Button>
                    </CopyToClipboard>
                    <br/><br/>

                  <Card body outline color="warning">
                    <CardTitle>Menu</CardTitle>
                    <CardText>
                    {shoppingList.recipes.map((item, key) => {
                          return <span key={key}><strong>{item}</strong><br/></span>})}
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
