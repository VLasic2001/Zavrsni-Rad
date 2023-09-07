import { Route, Routes } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { Layout } from "./components/Layout";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
	return (
		<Router>
			<Layout>
				<Routes>
					{AppRoutes.map((route, index) => {
						const { element, ...rest } = route;
						return (
							<Route
								key={index}
								{...rest}
								element={element}
							/>
						);
					})}
				</Routes>
			</Layout>
		</Router>
	);
}

export default App;
