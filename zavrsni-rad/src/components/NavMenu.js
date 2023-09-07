import React from "react";
import { Link } from "react-router-dom";
import "./NavMenu.css";

const NavMenu = () => {
	return (
		<nav>
			<Link
				className="link"
				to={"/"}
			>
				Početna stranica
			</Link>
			<div className="linkContainer">
				<Link
					className="link"
					to={"/admin"}
				>
					Admin
				</Link>
			</div>
		</nav>
	);
};

export default NavMenu;
