import React, { useEffect, useState } from "react";
import Select from "react-select";

const ToSubjects = ({ options, fromSubjectGrades, fromMajor }) => {
	const [selectToValue, setSelectToValue] = useState();
	const [toSubjects, setToSubjects] = useState();
	const [transferData, setTransferData] = useState();
	const [toSubjectsView, setToSubjectsView] = useState();
	const [passedSubjects, setPassedSubjects] = useState();

	useEffect(() => {
		if (!selectToValue || !fromMajor) return;
		import(`../data/transfers/${fromMajor}-${selectToValue.value}`).then((r) =>
			setTransferData(r.default)
		);
		setPassedSubjects({});
		import(`../data/majors/${selectToValue.value}`).then((r) => setToSubjects(r.default));
	}, [selectToValue, fromSubjectGrades]);

	useEffect(() => {
		if (!toSubjects) return;
		let recognizedSubjects = {};
		Object.keys(toSubjects).forEach((semester) => {
			toSubjects[semester].forEach((subject) => {
				if (isSubjectRecognized(subject)) {
					if (!recognizedSubjects[semester]) {
						recognizedSubjects[semester] = [subject];
					} else {
						recognizedSubjects[semester].push(subject);
					}
					console.log(recognizedSubjects);
				}
			});
		});
		if (recognizedSubjects) setPassedSubjects(recognizedSubjects);
	}, [transferData, toSubjects, fromSubjectGrades]);

	useEffect(() => {
		let view = (
			<>
				{passedSubjects && Object.keys(passedSubjects).length !== 0 ? (
					<div className="majorContainer">
						<span className="info">Kolegiji s novog smjera koji se priznaju studentu:</span>
						{Object.keys(passedSubjects).map((semester) => (
							<div
								key={semester}
								className="semesterContainer"
							>
								{semester}. Semestar:
								{passedSubjects[semester].map((subject) => (
									<div
										key={subject.id}
										className={subject.isElective ? "electiveContainer" : "subjectContainer"}
									>
										<span>{subject.name}</span>
									</div>
								))}
							</div>
						))}
						<span className="tipContainer">
							<span className="squareIcon">&#9632;</span> su označeni izborni predmeti
						</span>
					</div>
				) : (
					<div className="majorContainer">
						<span className="tipContainer">Nema priznatih kolegija</span>
					</div>
				)}
			</>
		);
		setToSubjectsView(view);
	}, [passedSubjects]);

	// console.log(fromSubjectGrades, transferData, toSubjects);

	const isSubjectRecognized = (subject) => {
		if (!transferData) return false;
		if (!transferData.transfers.find((transfer) => transfer.recognizedSubject === subject.id))
			return false;

		let numberOfRequiredSubjectsPassed = 0;
		const requiredSubjects = transferData.transfers.find(
			(transfer) => transfer.recognizedSubject === subject.id
		).requiredSubjects;

		requiredSubjects.forEach((rs) => {
			if (
				fromSubjectGrades.find((grade) => grade.id == rs) &&
				fromSubjectGrades.find((grade) => grade.id == rs).value > 1
			)
				numberOfRequiredSubjectsPassed++;
		});

		if (numberOfRequiredSubjectsPassed !== requiredSubjects.length) return false;

		return true;
	};

	return (
		<div className="majorToContainer">
			<span className="formTitle">Smjer na koji se student prebacuje:</span>
			<Select
				className="select"
				options={options}
				onChange={(v) => setSelectToValue(v)}
			/>
			{selectToValue && <span className="selectedMajorTitle">{selectToValue.label}</span>}
			{toSubjectsView && toSubjectsView}
		</div>
	);
};

export default ToSubjects;
