import React from 'react';
import {render} from 'react-dom';
import $ from 'jquery';
import PicturesStore from './stores/PicturesStore';
import Actions from './actions/Actions';
import MainPicture from './components/MainPicture';
import PicturesThumbs from './components/PicturesThumbs';
import CategoryHeader from './components/CategoryHeader';
import Menu from './components/Menu';

Actions.initStore();

let mainPictureRendered = false,
    categoryHeaderRendered = false,
    picturesThumbsRendered = false,
    menuRendered = false;

function afterRender(){

	//hide splash screen
	if(mainPictureRendered && categoryHeaderRendered && picturesThumbsRendered && menuRendered){
		$("#splash").fadeOut(800, function () {
			$(this).remove()
		});
	}
}

PicturesStore.addChangeListener(() => {
	render(
		<MainPicture />,
		document.getElementById("main-picture"),
		() => {
			mainPictureRendered = true;
			afterRender();
		}
	);

	render(
		<CategoryHeader />,
		document.getElementById("category-header"),
		() => {
			categoryHeaderRendered = true;
			afterRender();
		}
	);

	render(
		<PicturesThumbs />,
		document.getElementById("pictures-thumbs"),
		() => {
			picturesThumbsRendered = true;
			afterRender();
		}
	);

	render(
		<Menu />,
		document.getElementById("menu"),
		() => {
			menuRendered = true;
			afterRender();
		}
	);
});