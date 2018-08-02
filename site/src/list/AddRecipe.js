import React, { Component } from 'react';
import './List.css';
import Navbar from '../common/NavBar';
import { Container, Row, Col } from 'reactstrap';

class AddRecipe extends Component {
    constructor(props) {
		super(props);
		this.state = {
		  loading: true,
		  error: null,
		  ingredients: []
		};
		this.baseURL = "http://localhost:8080/";
	}

	componentDidMount() {
        this.setState({
			loading: true
		});

		fetch(this.baseURL + "ingredient.json")
		  .then(res => res.json())
		  .then(
			(result) => {
			  this.setState({
				ingredients: result,
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
    const { loading, error, ingredients } = this.state;

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
            <Row>
                <br/>
            </Row>
            <Row>
                <Col>
                    {ingredients.map(i => <span>{i.name + '|#|' + i.unit + '|#|' + i.type}<br/></span>)}
                </Col>
            </Row>
        </Container>
      </div>
    );
  }
}

export default AddRecipe;
