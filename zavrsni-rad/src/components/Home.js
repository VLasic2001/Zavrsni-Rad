import React, { useEffect, useState } from "react";
import data from "../data/data.json";
import FromSubjects from "./FromSubjects";
import ToSubjects from "./ToSubjects";
import NavMenu from "./NavMenu";
import "./Home.css";

const Home = () => {
	const [selectOptions, setSelectOptions] = useState([]);
	const [fromSubjectGrades, setFromSubjectGrades] = useState([]);
	const [fromMajor, setFromMajor] = useState();
	const [passedSubjects, setPassedSubjects] = useState();
	const [toMajor, setToMajor] = useState();

	useEffect(() => {
		const options = [];
		data.majors.sort((a, b) => a.id - b.id);
		data.majors.forEach((m) =>
			options.push({
				value: m.id,
				label: `${m.id} - ${m.name}`,
			})
		);
		setSelectOptions(options);
	}, []);

	const handlePassedSubjects = (subjects) => {
		setPassedSubjects(subjects);
	};

	const handleToMajor = (toMajor) => {
		setToMajor(toMajor);
	};

	const handleGradeChange = (name, value, id, semester) => {
		if (value > 5 || value < 0) return;
		let grades = fromSubjectGrades.filter((g) => g.id !== id);
		setFromSubjectGrades([...grades, { id, name, value, semester }]);
	};

	const resetGrades = () => {
		setFromSubjectGrades([]);
	};

	const handleFromMajor = (id) => {
		setFromMajor(id);
	};

	return (
		<>
			<NavMenu
				passedSubjects={passedSubjects}
				fromMajor={fromMajor}
				toMajor={toMajor}
			/>
			<div className="homeContainer">
				<FromSubjects
					options={selectOptions}
					handleGradeChange={handleGradeChange}
					fromSubjectGrades={fromSubjectGrades}
					resetGrades={resetGrades}
					handleFromMajor={handleFromMajor}
				/>
				<span className="arrowIcon">&#8680;</span>
				<ToSubjects
					options={selectOptions}
					fromSubjectGrades={fromSubjectGrades}
					fromMajor={fromMajor}
					handlePassedSubjects={handlePassedSubjects}
					handleToMajor={handleToMajor}
				/>
			</div>
		</>
	);
};

export default Home;
