import React, { useEffect, useState } from "react";
import Select from "react-select";

const ToSubjects = ({ options, fromSubjectGrades, fromMajor, handlePassedSubjects, handleToMajor }) => {
	const [selectToValue, setSelectToValue] = useState();
	const [toSubjects, setToSubjects] = useState();
	const [transferData, setTransferData] = useState();
	const [toSubjectsView, setToSubjectsView] = useState();
	const [passedSubjects, setPassedSubjects] = useState();
	const [transferNotFound, setTransferNotFound] = useState(false);

	useEffect(() => {
		if (!selectToValue || !fromMajor) return;
		setTransferNotFound(false);
		handleToMajor(selectToValue.value);
		import(`../data/transfers/${fromMajor}-${selectToValue.value}`)
			.catch(() => ({ default: setTransferNotFound(true) }))
			.then((r) => setTransferData(r.default));
		setPassedSubjects({});
		import(`../data/majors/${selectToValue.value}`)
			.catch(() => ({}))
			.then((r) => setToSubjects(r.default));
	}, [selectToValue, fromSubjectGrades]);

	useEffect(() => {
		if (!toSubjects) return;
		let recognizedSubjects = {};
		let grade;
		Object.keys(toSubjects).forEach((semester) => {
			toSubjects[semester].forEach((subject) => {
				if ((grade = isSubjectRecognized(subject))) {
					subject.grade = grade;
					if (!recognizedSubjects[semester]) {
						recognizedSubjects[semester] = [subject];
					} else {
						recognizedSubjects[semester].push(subject);
					}
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
										<span>
											Ocjena: {subject.grade}, ECTS: {subject.ects}
										</span>
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
						{transferNotFound ? (
							<span className="tipContainer">Nisu pronađene informacije o prelasku između ova dva studija</span>
						) : (
							<span className="tipContainer">Nema priznatih kolegija</span>
						)}
					</div>
				)}
			</>
		);
		setToSubjectsView(view);
		handlePassedSubjects(passedSubjects);
	}, [passedSubjects]);

	const isSubjectRecognized = (subject) => {
		if (!transferData) return false;
		if (!transferData.transfers.find((transfer) => transfer.recognizedSubject === subject.id)) return false;

		let numberOfRequiredSubjectsPassed = 0;
		let grade = 0;
		const requiredSubjects = transferData.transfers.find(
			(transfer) => transfer.recognizedSubject === subject.id
		).requiredSubjects;

		requiredSubjects.forEach((rs) => {
			let subjectGrade = fromSubjectGrades.find((grade) => grade.id === rs);
			if (subjectGrade && subjectGrade.value > 1) {
				numberOfRequiredSubjectsPassed++;
				grade += parseInt(subjectGrade.value);
			}
		});

		if (numberOfRequiredSubjectsPassed !== requiredSubjects.length) return false;

		return Math.round(grade / numberOfRequiredSubjectsPassed);
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
