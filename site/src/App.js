import React, { Component } from 'react';
import './App.css';
import Dropdown from './components/Dropdown';
import Navbar from './components/NavBar';
import { Container, Row, Col } from 'reactstrap';


class App extends Component {
    constructor(props) {
		super(props);
		this.state = {
		  loading: true,
		  error: null,
		  recipes: [],
		  ingredients: null
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
              ingredients.map((item) =>
                console.log(item.ingredient.name))

			  this.setState({
				ingredients: ingredients
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

    componentDidMount() {
        this.setState({
			loading: true
		});

		fetch(this.baseURL + "recipe.json")
		  .then(res => res.json())
		  .then(
			(result) => {
              let recipes = result.map((item) => item.name);
              console.log(recipes)
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
    const { loading, error, recipes, ingredients } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    }
    else if (loading) {
      return <div>Loading...</div>;
    }

    let list = ingredients ? ingredients.map((item) => {
                    return <Row>
                        <Col>
                            {item.quantity}
                        </Col>
                        <Col>
                            {item.ingredient.name}
                        </Col>
                        <Col>
                            {item.ingredient.unit}
                        </Col>
                    </Row>
                }) : '';

    return (
      <div>
        <Navbar brand='lyst' links={[['Link1', '/link1'], ['Link2', '/link2']]}/ >
        <Container>
            <Row>
                <Col>
                <Dropdown
                    items={recipes}
                    title='Recipes'
                    onDropdownChange={this.handleDropdown}/>
                </Col>
            </Row>
            {list}
        </Container>
      </div>
    );
  }
}

export default App;
