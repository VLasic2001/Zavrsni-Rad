import Home from "./components/Home";
import Export from "./components/Export";

const AppRoutes = [
	{
		index: true,
		element: <Home />,
	},
	{
		path: "/export",
		element: <Export />,
	},
];

export default AppRoutes;
