import React from 'react';
import Constants from '../Constants';
import Actions from '../actions/Actions';
import PicturesStore from '../stores/PicturesStore';

class MainPicture extends React.Component {

	constructor() {
		super();

		this.state = {
			picture                 : PicturesStore.getMainPicture(),
			showButtons             : false,
			totalCount              : PicturesStore.getCategoryPicturesCount(),
			currentPictureThumbIndex: PicturesStore.getThumbIndexOfMainPicture()
		};

		this.updatePicture = this.updatePicture.bind(this);
	}

	updatePicture() {
		this.setState({
			picture                 : PicturesStore.getMainPicture(),
			totalCount              : PicturesStore.getCategoryPicturesCount(),
			currentPictureThumbIndex: PicturesStore.getThumbIndexOfMainPicture()
		});
	}

	showPrevious() {
		Actions.changeMainPicture(Constants.PREVIOUS_PICTURE);
	}

	showNext() {
		Actions.changeMainPicture(Constants.NEXT_PICTURE);
	}

	showButtons() {
		this.setState({
			showButtons: true
		});
	}

	hideButtons() {
		this.setState({
			showButtons: false
		});
	}

	componentDidMount() {
		PicturesStore.addChangeListener(this.updatePicture);
	}

	componentWillUnmount() {
		PicturesStore.removeChangeListener(this.updatePicture);
	}

	render() {

		let leftButton, rightButton;

		if (this.state.showButtons) {

			leftButton = <div>
				<img src={ Constants.RESOURCES.LEFT_ARROW }
				     alt="Previous"
				     onClick={ this.showPrevious.bind(this) }
				     className={ this.state.currentPictureThumbIndex > 0 ? "" : "disabled" }/>
			</div>;

			rightButton = <div>
				<img src={ Constants.RESOURCES.RIGHT_ARROW }
				     alt="Next"
				     onClick={ this.showNext.bind(this) }
				     className={ this.state.currentPictureThumbIndex < this.state.totalCount - 1 ? "" : "disabled" }/>
			</div>;
		}

		return (
			
			<div onMouseEnter={ this.showButtons.bind(this) } onMouseLeave={ this.hideButtons.bind(this) }>
				<div id="background" style={ { backgroundImage: "url('" + this.state.picture + "')"} }></div>
				<div id="content">
					<img src={ this.state.picture }/>
				</div>
				<div id="arrows">
					{ leftButton }
					{ rightButton }
				</div>
			</div>
		);
	}
}

export default MainPicture;