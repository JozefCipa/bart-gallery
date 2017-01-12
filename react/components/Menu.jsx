import React from 'react';
import Constants from '../Constants';
import Uploader from './Uploader';
import Categories from './Categories';
import $ from 'jquery';

class Menu extends React.Component {

	constructor() {
		super();

		this.state = {
			showMenu: false
		};
	}

	toggleMenu() {

		let menuVisibility = !this.state.showMenu;

		this.setState({
			showMenu: menuVisibility
		});
	}

	render() {

		if (this.state.showMenu) {

			//disable scrolling lower layer
			$("aside").addClass("stay-fixed");

			return (
				<div className="overlay">
					<div id="menu-wrapper">
						<div id="menu-icon">
							<img src={ Constants.RESOURCES.CLOSE_ICON }
							     alt="Menu"
							     onClick={ this.toggleMenu.bind(this) }/>
						</div>
						<Categories />
						<Uploader />
					</div>
				</div>
			);
		}
		else {
			$("aside").removeClass("stay-fixed");

			return (
				<div>
					<div id="menu-icon">
						<img src={ Constants.RESOURCES.MENU_ICON }
						     alt="Menu"
						     onClick={ this.toggleMenu.bind(this) }/>
					</div>
				</div>
			);
		}
	}
}

export default Menu;