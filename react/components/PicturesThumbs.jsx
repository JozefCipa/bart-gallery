import React from 'react';
import Constants from '../Constants';
import PicturesStore from '../stores/PicturesStore';
import Actions from '../actions/Actions';

class PicturesThumbs extends React.Component {

	constructor() {
		super();

		this.state = {
			thumbs: PicturesStore.getThumbs(),
			totalCount: PicturesStore.getCategoryPicturesCount()
		};

		this.updateThumbs = this.updateThumbs.bind(this);
	}

	componentDidMount(){
		PicturesStore.addChangeListener(this.updateThumbs);
	}

	componentWillUnmount(){
		PicturesStore.removeChangeListener(this.updateThumbs);
	}

	updateThumbs(){
		this.setState({
			thumbs: PicturesStore.getThumbs(),
			totalCount: PicturesStore.getCategoryPicturesCount()
		});
	}

	loadMore() {
		Actions.loadMoreThumbs();
	}

	changeMainPicture(name){
		Actions.changeMainPicture(name);
	}

	render() {

		let moreButton;
		if(this.state.thumbs.length < this.state.totalCount){
			moreButton = <li>
				<button id="more" onClick={ this.loadMore.bind(this) }>Load more</button>
			</li>;
		}

		return (
			<ul>
				{
					this.state.thumbs.map((thumb, key) => {
						return (
							<li key={ key }>
								<img src={ thumb.url }
								     className={ thumb.isCurrent ? "active" : "" }
								     onClick={ this.changeMainPicture.bind(this, thumb.name) }
								/>
							</li>
						);
					})
				}
				{ moreButton }
			</ul>
		);
	}
}

export default PicturesThumbs;