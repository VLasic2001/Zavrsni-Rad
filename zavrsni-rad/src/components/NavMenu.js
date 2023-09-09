import React from "react";
import { Link } from "react-router-dom";
import "./NavMenu.css";

const NavMenu = (passedSubjects) => {
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
					to={"/export"}
					state={{ data: { passedSubjects: passedSubjects } }}
				>
					Export
				</Link>
			</div>
		</nav>
	);
};

export default NavMenu;
