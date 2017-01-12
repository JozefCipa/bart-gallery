import React from 'react';
import Actions from '../actions/Actions';
import PicturesStore from '../stores/PicturesStore';

class Categories extends React.Component {

	constructor() {
		super();

		this.state = {
			categories: PicturesStore.getCategories()
		};

		this.updateCategories = this.updateCategories.bind(this);
	}

	changeCategory(name){
		Actions.changeCategory(name);
	}

	updateCategories(){
		this.setState({
			categories: PicturesStore.getCategories()
		});
	}

	componentDidMount() {
		PicturesStore.addChangeListener(this.updateCategories);
	}

	componentWillUnmount() {
		PicturesStore.removeChangeListener(this.updateCategories);
	}

	render() {
		return (
			<div id="categories-list">
				<ul>
					{
						this.state.categories.map((category, key) => {
							return <li key={ key } onClick={ this.changeCategory.bind(this, category.name) } className= { category.isActive ? "active" : ""}>
								{ category.name }
							</li>;
						})
					}
				</ul>
			</div>
		);
	}
}

export default Categories;