import React, { useState, useEffect } from "react";
import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, WidthType } from "docx";
import FileSaver from "file-saver";
import NavMenu from "./NavMenu";
import { useLocation } from "react-router-dom";
import "./Export.css";

const Export = () => {
	const location = useLocation();
	const { data } = location.state;
	const passedSubjects = data.passedSubjects.passedSubjects;
	const fromMajor = data.passedSubjects.fromMajor;
	const toMajor = data.passedSubjects.toMajor;

	const [fromSubjects, setFromSubjects] = useState();
	const [transferData, setTransferData] = useState();

	useEffect(() => {
		if (!fromMajor) return;
		import(`../data/majors/${fromMajor}`)
			.catch(() => ({}))
			.then((r) => setFromSubjects(r.default));
		import(`../data/transfers/${fromMajor}-${toMajor}`)
			.catch(() => ({}))
			.then((r) => setTransferData(r.default));
	}, []);

	const findSubjectById = (id) => {
		if (!fromSubjects) return;
		let foundSubject;
		Object.keys(fromSubjects).forEach((semester) => {
			fromSubjects[semester].map((subject) => {
				if (subject.id == id) {
					foundSubject = subject;
				}
			});
		});
		return foundSubject;
	};

	const calculateRequiredSubjects = (subject) => {
		let requiredSubjectsNames = "";
		if (!transferData) return;
		transferData.transfers
			.find((transfer) => transfer.recognizedSubject == subject.id)
			.requiredSubjects.forEach((sub) => {
				requiredSubjectsNames += `${findSubjectById(sub).name}, `;
			});
		return requiredSubjectsNames.slice(0, -2);
	};

	const calculateSubjectRow = (subject) => {
		let row = new TableRow({
			children: [
				new TableCell({
					children: [
						new Paragraph({
							children: [
								new TextRun({
									text: `${subject.name}`,
									font: "Calibri",
								}),
							],
						}),
					],
				}),
				new TableCell({
					children: [
						new Paragraph({
							children: [
								new TextRun({
									text: `${calculateRequiredSubjects(subject)}`,
									font: "Calibri",
								}),
							],
						}),
					],
				}),
				new TableCell({
					children: [
						new Paragraph({
							children: [
								new TextRun({
									text: `${subject.grade}`,
									font: "Calibri",
								}),
							],
							alignment: "center",
						}),
					],
				}),
				new TableCell({
					children: [
						new Paragraph({
							children: [
								new TextRun({
									text: `${subject.ects}`,
									font: "Calibri",
								}),
							],
							alignment: "center",
						}),
					],
				}),
			],
		});
		return row;
	};

	const calculateSubjectRows = (semester) => {
		let rows = [];
		passedSubjects[semester].forEach((subject) => {
			rows.push(calculateSubjectRow(subject));
		});
		return rows;
	};

	const calculateRows = () => {
		let rows = [];
		Object.keys(passedSubjects).forEach((semester) => {
			rows.push(
				new TableRow({
					children: [
						new TableCell({
							width: {
								size: 14020,
								type: WidthType.DXA,
							},
							columnSpan: [4],
							children: [
								new Paragraph({
									children: [
										new TextRun({
											text: `${semester}. Semestar`,
											bold: true,
											font: "Calibri",
										}),
									],
									alignment: "center",
								}),
							],
						}),
					],
				})
			);
			rows.push(...calculateSubjectRows(semester));
		});
		return rows;
	};

	const calculateTable = () => {
		if (!passedSubjects) return;

		let totalEcts = 0;
		Object.keys(passedSubjects).forEach((semester) => {
			passedSubjects[semester].forEach((subject) => {
				totalEcts += subject.ects;
			});
		});

		const table = new Table({
			columnWidths: [5505, 5505, 1505, 1505],
			rows: [
				new TableRow({
					children: [
						new TableCell({
							width: {
								size: 5505,
								type: WidthType.DXA,
							},
							children: [
								new Paragraph({
									children: [
										new TextRun({
											text: `Predmet na ${toMajor}`,
											bold: true,
											font: "Calibri",
										}),
									],
									alignment: "center",
								}),
							],
						}),
						new TableCell({
							width: {
								size: 5505,
								type: WidthType.DXA,
							},
							children: [
								new Paragraph({
									children: [
										new TextRun({
											text: `Položen predmet na ${fromMajor}`,
											bold: true,
											font: "Calibri",
										}),
									],
									alignment: "center",
								}),
							],
						}),
						new TableCell({
							width: {
								size: 1805,
								type: WidthType.DXA,
							},
							children: [
								new Paragraph({
									children: [
										new TextRun({
											text: "Ocjena",
											bold: true,
											font: "Calibri",
										}),
									],
									alignment: "center",
								}),
							],
						}),
						new TableCell({
							width: {
								size: 1505,
								type: WidthType.DXA,
							},
							children: [
								new Paragraph({
									children: [
										new TextRun({
											text: `ECTS`,
											bold: true,
											font: "Calibri",
										}),
									],
									alignment: "center",
								}),
							],
						}),
					],
				}),
				...calculateRows(),
				new TableRow({
					children: [
						new TableCell({
							width: {
								size: 14020,
								type: WidthType.DXA,
							},
							columnSpan: [3],
							children: [
								new Paragraph({
									children: [
										new TextRun({
											text: `UKUPNO`,
											bold: true,
											font: "Calibri",
										}),
									],
								}),
							],
						}),
						new TableCell({
							width: {
								size: 1505,
								type: WidthType.DXA,
							},
							children: [
								new Paragraph({
									children: [
										new TextRun({
											text: `${totalEcts}`,
											font: "Calibri",
										}),
									],
									alignment: "center",
								}),
							],
						}),
					],
				}),
			],
		});
		return table;
	};

	const doc = new Document({
		paragraphStyles: [
			{
				id: "aside",
				name: "Aside",
				basedOn: "Normal",
				next: "Normal",
				run: {
					backgroundColor: "58595a",
					italics: true,
				},
			},
		],
		sections: [
			{
				children: [calculateTable()],
			},
		],
	});

	const print = () => {
		Packer.toBlob(doc).then((buffer) => {
			FileSaver.saveAs(buffer, "Priznavanje.docx");
		});
	};

	return (
		<>
			<NavMenu />
			<button
				className="exportButton"
				onClick={print}
			>
				Export
			</button>
		</>
	);
};

export default Export;
