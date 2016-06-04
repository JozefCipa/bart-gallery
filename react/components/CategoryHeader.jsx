import React from 'react';
import PicturesStore from '../stores/PicturesStore';

class CategoryHeader extends React.Component {

	constructor() {
		super();

		this.state = PicturesStore.getCurrentCategory();
		this.updateCategoryInfo = this.updateCategoryInfo.bind(this);
	}

	updateCategoryInfo(){
		this.setState(PicturesStore.getCurrentCategory());
	}

	componentDidMount(){
		PicturesStore.addChangeListener(this.updateCategoryInfo);
	}

	componentWillUnmount(){
		PicturesStore.removeChangeListener(this.updateCategoryInfo);
	}

	render() {

		return (
			<div>
				<h1>{ this.state.name }</h1>
				<span>Count: { this.state.count } </span>
			</div>
		);
	}
}

export default CategoryHeader;