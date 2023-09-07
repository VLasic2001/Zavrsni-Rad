import Home from "./components/Home";
import Admin from "./components/Admin";

const AppRoutes = [
	{
		index: true,
		element: <Home />,
	},
	{
		path: "/admin",
		element: <Admin />,
	},
];

export default AppRoutes;
