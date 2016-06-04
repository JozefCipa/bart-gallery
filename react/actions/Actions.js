import Constants from '../Constants';
import AppDispatcher from '../AppDispatcher';

class Actions {

	static changeCategory(categoryName) {
		AppDispatcher.dispatch({
			action: Constants.ACTIONS.LOAD_CATEGORY,
			data: categoryName
		});
	}

	static changeMainPicture(value) {
		AppDispatcher.dispatch({
			action: Constants.ACTIONS.CHANGE_MAIN_PICTURE,
			data: value
		});
	}

	static loadMoreThumbs() {
		AppDispatcher.dispatch({
			action: Constants.ACTIONS.LOAD_MORE,
			data: null
		});
	}

	static uploadPicture(picture, categoryName){
		AppDispatcher.dispatch({
			action: Constants.ACTIONS.UPLOAD_PICTURE,
			data: {
				picture: picture,
				categoryName: categoryName
			}
		});
	}

	static initStore() {
		AppDispatcher.dispatch({
			action: Constants.ACTIONS.INIT_STORE,
			data: null
		});
	}
}

export default Actions;