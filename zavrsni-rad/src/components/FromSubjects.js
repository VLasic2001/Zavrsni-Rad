import React, { useEffect, useState } from "react";
import Select from "react-select";

const FromSubjects = ({
	options,
	handleGradeChange,
	fromSubjectGrades,
	resetGrades,
	handleFromMajor,
}) => {
	const [selectFromValue, setSelectFromValue] = useState();
	const [fromSubjects, setFromSubjects] = useState();
	const [fromSubjectsView, setFromSubjectsView] = useState();

	useEffect(() => {
		resetGrades();
		if (!selectFromValue) return;
		import(`../data/majors/${selectFromValue.value}`).then((r) => setFromSubjects(r.default));
		handleFromMajor(selectFromValue.value);
	}, [selectFromValue]);

	useEffect(() => {
		if (!fromSubjects) return;
		let view = (
			<div className="majorContainer">
				{Object.keys(fromSubjects).map((semester) => (
					<div
						key={semester}
						className="semesterContainer"
					>
						{semester}. Semestar:
						{fromSubjects[semester].map((subject) => (
							<div
								key={subject.id}
								className={subject.isElective ? "electiveContainer" : "subjectContainer"}
							>
								<span>{subject.name}</span>
								<span>
									Ocjena:{" "}
									<input
										name={subject.name}
										id={subject.id}
										data-semester={semester}
										type="number"
										min="0"
										max="5"
										value={
											fromSubjectGrades.find((e) => e.id === subject.id)
												? fromSubjectGrades.find((e) => e.id === subject.id).value
												: 0
										}
										className="gradeInput"
										onChange={(e) =>
											handleGradeChange(subject.name, e.target.value, subject.id, semester)
										}
									/>
								</span>
							</div>
						))}
					</div>
				))}
				<span className="tipContainer">
					<span className="squareIcon">&#9632;</span> su označeni izborni predmeti
				</span>
			</div>
		);
		setFromSubjectsView(view);
	}, [fromSubjects, fromSubjectGrades]);

	return (
		<div className="majorFromContainer">
			<span className="formTitle">Smjer s kojeg se student prebacuje:</span>
			<Select
				className="select"
				options={options}
				onChange={(v) => setSelectFromValue(v)}
			/>
			{selectFromValue && <span className="selectedMajorTitle">{selectFromValue.label}</span>}
			{fromSubjectsView && fromSubjectsView}
		</div>
	);
};

export default FromSubjects;
