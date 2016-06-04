import { EventEmitter } from 'events';
import Constants from '../Constants';
import AppDispatcher from '../AppDispatcher';
import $ from 'jquery'; //for AJAX requests

/**
 * Entire application data
 *
 * @type {{categories: Array, currentCategory: {name: string, count: string, categoryUrl: string, mainPicture: string, thumbs: Array}}}
 */
let application = {
	categories     : [],
	currentCategory: {
		name       : "",
		count      : "",
		categoryUrl: "",
		mainPicture: "",

		thumbs: []
	}
};

//API calls functions

/**
 * Load categories on startup and load first category
 */
function loadInitData() {
	$.ajax({
		url     : Constants.API.GET_CATEGORIES,
		success : (res) => {
			application.categories = prepareCategories(res.categories);

			//mark first category as active
			application.categories[0].isActive = true;
		},
		complete: () => {
			loadCategory(application.categories[0].name);
		}
	});
}

/**
 * Load category
 *
 * @param category
 */
function loadCategory(category) {
	$.ajax({
		url     : Constants.API.GET_CATEGORY + category + "/" + Constants.OPTIONS.THUMBS_COUNT,
		success : (res) => {

			if (res.error) {
				console.log(res.error);
				return;
			}

			application = res;

			application.categories = prepareCategories(res.categories);

			application.currentCategory.thumbs = application.currentCategory.thumbs.map((thumb) => {
				return {
					name     : thumb,
					isCurrent: false
				};
			});

			//set first thumb as active
			application.currentCategory.thumbs[0].isCurrent = true;

			//mark category as active
			application.categories.map((cat) => {
				if (cat.name == category)
					cat.isActive = true;
			});

		},
		complete: () => {
			PicturesStore.emitChange();
		}
	})
}

/**
 * Load category for given thumb
 *
 * @param thumbName
 */
function loadMainPicture(thumbName) {

	$.ajax({
		url     : Constants.API.GET_MAIN_PICTURE + application.currentCategory.name + "/" + thumbName,
		success : (res) => {

			application.currentCategory.mainPicture = res.mainPicture;
		},
		complete: () => {
			PicturesStore.emitChange();
		}
	});
}

/**
 * Load more thumbs in
 *
 * @param newCurrentIndex
 * @param emitChange
 * @param callback
 */
function loadMoreThumbs(newCurrentIndex, emitChange = true, callback = null) {

	let count = application.currentCategory.thumbs.length + Constants.OPTIONS.THUMBS_COUNT;
	let categoryName = application.currentCategory.name;

	$.ajax({
		url     : Constants.API.GET_MORE_THUMBS + categoryName + "/" + count,
		success : (res) => {

			if (res.error) {
				console.log("ERROR " + res.error);
				return;
			}

			application.currentCategory.thumbs = res.thumbs.map((thumb) => {
				return {
					name     : thumb,
					isCurrent: false
				}
			});

			application.currentCategory.thumbs[newCurrentIndex].isCurrent = true;
		},
		complete: () => {

			if (emitChange)
				PicturesStore.emitChange();
			else
				callback();
		}
	});
}

/**
 * Upload picture to given category
 *
 * @param picture
 * @param category
 */
function uploadPicture(picture, category) {

	let data = new FormData();
	data.append('picture', picture);
	data.append('category', category);

	$.ajax({
		url        : Constants.API.UPLOAD,
		method     : "post",
		data       : data,
		processData: false,
		contentType: false,

		success: (res) => {

			if (res.error) {
				console.log(res.error);
				return;
			}

			// when picture is uploaded, switch to its category
			loadCategory(category);
		}
	});


}

/**
 * Return index of current picture by its thumb
 *
 * @returns {number}
 */
function getIndexOfCurrentThumb() {
	return application.currentCategory.thumbs.findIndex((thumb) => {
		return thumb.isCurrent;
	});
}

/**
 * Assign picture thumb as current
 *
 * @param thumbName
 */
function changeCurrentPicture(thumbName) {
	application.currentCategory.thumbs.forEach((thumb) => {

		//find previous current
		if (thumb.isCurrent)
			thumb.isCurrent = false;

		//set new current thumb
		if (thumb.name == thumbName)
			thumb.isCurrent = true;
	});
}

/**
 * Return name of file from path
 *
 * @param path
 * @returns {T}
 */
function basename(path) {
	return path.split('/').reverse()[0];
}

function prepareCategories(categories) {
	return categories.map((category) => {
		return {
			name    : category,
			isActive: false
		};
	});
}

const PicturesStore = Object.assign(EventEmitter.prototype, {
	getCategories(){
		return application.categories;
	},

	getCurrentCategory(){
		return {
			name : application.currentCategory.name,
			count: application.currentCategory.count
		};
	},

	getMainPicture(){
		return application.currentCategory.mainPicture;
	},

	getThumbs(){
		return application.currentCategory.thumbs.map((thumb) => {
			return {
				name     : thumb.name,
				url      : application.currentCategory.categoryUrl + thumb.name,
				isCurrent: thumb.isCurrent
			};
		});
	},

	getCategoryPicturesCount(){
		return application.currentCategory.count;
	},

	getThumbIndexOfMainPicture(){
		return application.currentCategory.thumbs.findIndex((thumb) => {
			return thumb.isCurrent;
		});
	},

	emitChange(){
		this.emit(Constants.CHANGE_EVENT);
	},

	addChangeListener(callback){
		this.on(Constants.CHANGE_EVENT, callback);
	},

	removeChangeListener(callback){
		this.removeListener(Constants.CHANGE_EVENT, callback);
	}

});

// Register dispatcher callback
AppDispatcher.register((payload) => {

	const action = payload.action;
	const data = payload.data;

	// Define what to do for certain actions
	switch (action) {
		case Constants.ACTIONS.LOAD_CATEGORY:
			loadCategory(data);

			break;
		case Constants.ACTIONS.CHANGE_MAIN_PICTURE:

			if (data == Constants.PREVIOUS_PICTURE) {
				let index = getIndexOfCurrentThumb();
				index--; //previous picture

				if (index >= 0) {
					loadMainPicture(basename(application.currentCategory.thumbs[index].name));
					changeCurrentPicture(application.currentCategory.thumbs[index].name);
				}
			}
			else if (data == Constants.NEXT_PICTURE) {
				let index = getIndexOfCurrentThumb();
				index++; //next picture

				if (index < application.currentCategory.thumbs.length) {
					loadMainPicture(basename(application.currentCategory.thumbs[index].name));
					changeCurrentPicture(application.currentCategory.thumbs[index].name);
				}
				else if (index >= application.currentCategory.thumbs.length && index < application.currentCategory.count) {

					//current picture is new, first from new loaded
					loadMoreThumbs(index, false, () => {
						loadMainPicture(basename(application.currentCategory.thumbs[index].name));
						changeCurrentPicture(application.currentCategory.thumbs[index].name);
					});
				}
			}
			else {
				loadMainPicture(basename(data)); //data is name of thumb
				changeCurrentPicture(data);
			}

			break;
		case Constants.ACTIONS.LOAD_MORE:

			//current picture stay current
			loadMoreThumbs(getIndexOfCurrentThumb());

			break;
		case Constants.ACTIONS.UPLOAD_PICTURE:

			uploadPicture(data.picture, data.categoryName);

			break;

		case Constants.ACTIONS.INIT_STORE:
			loadInitData();

			break;
	}

	return true;
});

export default PicturesStore;