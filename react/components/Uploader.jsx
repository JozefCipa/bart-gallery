import React from 'react';
import Actions from '../actions/Actions';
import PicturesStore from '../stores/PicturesStore';
import Dropzone from 'react-dropzone';

class Uploader extends React.Component {

	constructor() {
		super();

		this.state = {
			picture        : null,
			categories     : PicturesStore.getCategories(),
			choosedCategory: PicturesStore.getCurrentCategory().name
		};

		this.uploaded = this.uploaded.bind(this);
	}

	componentDidMount() {
		PicturesStore.addChangeListener(this.uploaded);
	}

	componentWillUnmount() {
		PicturesStore.removeChangeListener(this.uploaded);
	}

	uploaded() {
		this.setState({
			picture        : null,
			categories     : PicturesStore.getCategories(),
			choosedCategory: PicturesStore.getCurrentCategory().name
		});
	}

	upload() {
		if (this.state.picture != null)
			Actions.uploadPicture(this.state.picture, this.state.choosedCategory);
	}

	onDrop(files) {
		this.setState({
			picture: files[0]
		});
	}

	chooseCategory(event) {

		if(event.target.value) {
			this.setState({
				choosedCategory: event.target.value
			});
		}
	}

	render() {

		let content;
		if (this.state.picture != null)
			content = <div>
				<img src={ this.state.picture.preview } id="picture-upload-preview"/>
			</div>;
		else
			content = <div>Drop your picture here to upload.</div>;

		return (
			<div id="upload">
				<Dropzone onDrop={ this.onDrop.bind(this) } accept="image/*" className="custom-dropzone"
				          activeClassName="custom-dropzone-active">
					{ content }
				</Dropzone>
				<span>Choose category: </span>
				<select onChange={ this.chooseCategory.bind(this) } id="select-category"
				        value={ this.state.choosedCategory.toLowerCase() }>
					{
						this.state.categories.map((category, key) => {
							return <option key={ key } value={ category.name }>{ category.name }</option>
						})
					}
				</select>
				<div>or create new:</div>
				<input type="text" id="new-category-name" onBlur={ this.chooseCategory.bind(this) }
				       placeholder="Type new category name" />
				<button id="upload-btn" onClick={ this.upload.bind(this) }
				        className={ this.state.picture == null ? "disabled" : "" }>Upload picture
				</button>
			</div>
		);
	}
}

export default Uploader;