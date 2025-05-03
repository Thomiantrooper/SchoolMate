import React from 'react';
import { HiChartBar, HiDownload } from 'react-icons/hi';
import { Badge, Table, Card, Button } from 'flowbite-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AcademicMarks({ studentData }) {
  const calculateTermStats = (term) => {
    if (!studentData?.marks) return { subjects: [], total: 0, average: 0 };
    const subjects = studentData.marks
      .map((mark) => ({
        subjectId: mark.subject,
        subjectName: mark.subject,
        mark: mark[term],
      }))
      .filter((subject) => subject.mark !== undefined && subject.mark !== null);
    const total = subjects.reduce((sum, subject) => sum + subject.mark, 0);
    const average = subjects.length > 0 ? (total / subjects.length).toFixed(2) : 0;
    return { subjects, total, average };
  };

  const handleDownloadFullPDF = () => {
    const doc = new jsPDF();
    doc.setProperties({
      title: `Full Academic Report - ${studentData.name}`,
      subject: 'Academic Performance Report',
      author: 'School Management System',
    });
  
    const terms = [
      { name: 'First', data: firstTerm },
      { name: 'Second', data: secondTerm },
      { name: 'Third', data: thirdTerm },
    ];
  
    let yOffset = 20;
  
    terms.forEach((term, index) => {
      if (!term.data.subjects.length) return;
  
      if (index > 0) {
        doc.addPage();
        yOffset = 20;
      }
  
      doc.setTextColor(40, 53, 147);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('SCHOOL NAME', 105, yOffset, { align: 'center' });
  
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.text('Academic Performance Report', 105, yOffset + 10, { align: 'center' });
      doc.text(`${term.name} Term`, 105, yOffset + 20, { align: 'center' });
  
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Student Information', 14, yOffset + 35);
      doc.setFont('helvetica', 'normal');
      doc.text(`Student ID: ${studentData._id}`, 14, yOffset + 45);
      doc.text(`Name: ${studentData.name}`, 14, yOffset + 55);
      doc.text(`Grade: ${studentData.grade}`, 14, yOffset + 65);
      doc.text(`Section: ${studentData.section}`, 14, yOffset + 75);
  
      const tableData = term.data.subjects.map((subject) => [
        subject.subjectId,
        subject.subjectName,
        subject.mark,
        '100',
        term.data.average,
      ]);
  
      autoTable(doc, {
        startY: yOffset + 85,
        head: [['Subject Code', 'Subject Name', 'Marks', 'Total Marks', 'Average']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [40, 53, 147], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [240, 240, 240] },
      });
  
      const summaryY = doc.lastAutoTable.finalY + 10;
      doc.setFont('helvetica', 'bold');
      doc.text('Term Summary', 14, summaryY);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total Marks: ${term.data.total}`, 14, summaryY + 10);
      doc.text(`Average: ${term.data.average}`, 14, summaryY + 20);
      doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 14, summaryY + 30);
    });
  
    doc.save(`${studentData.name}_Full_Academic_Report.pdf`);
  };
  

  const generateTermReport = (termData, termName, student) => {
    if (!termData?.subjects?.length) return alert('No marks available to generate the report.');
    const doc = new jsPDF();
    doc.setProperties({
      title: `${termName} Term Report - ${student.name}`,
      subject: 'Academic Performance Report',
      author: 'School Management System',
    });
    doc.setTextColor(40, 53, 147);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('SCHOOL NAME', 105, 20, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text('Academic Performance Report', 105, 30, { align: 'center' });
    doc.text(`${termName} Term`, 105, 40, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Student Information', 14, 55);
    doc.setFont('helvetica', 'normal');
    doc.text(`Student ID: ${student._id}`, 14, 65);
    doc.text(`Name: ${student.name}`, 14, 75);
    doc.text(`Grade: ${student.grade}`, 14, 85);
    doc.text(`Section: ${student.section}`, 14, 95);

    const tableData = termData.subjects.map((subject) => [
      subject.subjectId,
      subject.subjectName,
      subject.mark,
      '100',
      termData.average,
    ]);

    autoTable(doc, {
      startY: 105,
      head: [['Subject Code', 'Subject Name', 'Marks', 'Total Marks', 'Average']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [40, 53, 147], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Term Summary', 14, finalY);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Marks: ${termData.total}`, 14, finalY + 10);
    doc.text(`Average: ${termData.average}`, 14, finalY + 20);
    doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 14, finalY + 30);

    doc.save(`${student.name}_${termName}_Term_Report.pdf`);
  };

  const firstTerm = calculateTermStats('firstTerm');
  const secondTerm = calculateTermStats('secondTerm');
  const thirdTerm = calculateTermStats('thirdTerm');

  const TermReportCard = ({ termData, termName, termNumber }) => (
    <Card className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-700">{termNumber} Term</h3>
        <div className="flex items-center space-x-4">
          <Badge color="success" size="lg">Total: {termData.total}</Badge>
          <Badge color="info" size="lg">Average: {termData.average}</Badge>
          <Button size="sm" onClick={() => generateTermReport(termData, termName, studentData)}>
            <HiDownload className="mr-2" />
            Download Report
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table hoverable className="w-full">
          <Table.Head className="bg-gray-100">
            <Table.HeadCell>Subject ID</Table.HeadCell>
            <Table.HeadCell>Subject Name</Table.HeadCell>
            <Table.HeadCell>Marks</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {termData.subjects.length > 0 ? (
              termData.subjects.map((subject, index) => (
                <Table.Row key={`${termName}-${subject.subjectId || index}`}>
                  <Table.Cell>{subject.subjectId}</Table.Cell>
                  <Table.Cell>{subject.subjectName}</Table.Cell>
                  <Table.Cell>
                    <span className={`px-3 py-1 rounded-full ${
                      subject.mark >= 75
                        ? 'bg-green-100 text-green-800'
                        : subject.mark >= 50
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {subject.mark}
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan="3" className="text-center py-6 text-gray-500">
                  No marks available for {termName.toLowerCase()} term
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    </Card>
  );

  return (
    <div className="relative p-8">
      {/* Full Report Button */}
      <div className="flex justify-end mb-4">
        <Button color="gray" onClick={handleDownloadFullPDF}>
          <HiDownload className="mr-2" />
          Download Full Report
        </Button>
      </div>

      {/* Academic Content */}
      <div id="academic-performance" className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          <HiChartBar className="mr-2 text-blue-600" />
          Academic Performance
        </h2>

        <TermReportCard termData={firstTerm} termName="First" termNumber="1st" />
        <TermReportCard termData={secondTerm} termName="Second" termNumber="2nd" />
        <TermReportCard termData={thirdTerm} termName="Third" termNumber="3rd" />
      </div>
    </div>
  );
}
