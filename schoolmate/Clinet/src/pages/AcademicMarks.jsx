import { HiChartBar, HiDownload } from 'react-icons/hi';
import { Badge, Table, Card, Button } from 'flowbite-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AcademicMarks({ studentData }) {
  // Calculate term statistics
  const calculateTermStats = (term) => {
    if (!studentData?.marks) return { subjects: [], total: 0, average: 0 };
    
    const subjects = studentData.marks.map(mark => ({
      subjectId: mark.subject,
      subjectName: mark.subject,
      mark: mark[term]
    })).filter(subject => subject.mark !== undefined && subject.mark !== null);

    const total = subjects.reduce((sum, subject) => sum + subject.mark, 0);
    const average = subjects.length > 0 ? (total / subjects.length).toFixed(2) : 0;

    return { subjects, total, average };
  };

  const generateTermReport = (termData, termName, student) => {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Add autoTable to doc instance
    doc.autoTable = autoTable;
    
    // Set document properties
    doc.setProperties({
      title: `${termName} Term Report - ${student.name}`,
      subject: 'Academic Performance Report',
      author: 'School Management System'
    });

    // Add school logo or heade
    // doc.setFontSize(20);
    doc.setTextColor(40, 53, 147);
    doc.setFont('helvetica', 'bold');
    doc.text('SCHOOL NAME', 105, 20, { align: 'center' });
    
    // doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Academic Performance Report', 105, 30, { align: 'center' });
    
    // doc.setFontSize(14);
    doc.text(`${termName} Term`, 105, 40, { align: 'center' });

    // Student information section
    // doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Student Information', 14, 55);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Student ID: ${student._id}`, 14, 65);
    doc.text(`Name: ${student.name}`, 14, 75);
    doc.text(`Grade: ${student.grade}`, 14, 85);
    doc.text(`Section: ${student.section}`, 14, 95);

    // Prepare table data
    const tableData = termData.subjects.map(subject => [
      subject.subjectId,
      subject.subjectName,
      subject.mark,
      '100', // Assuming total marks is always 100
      termData.average
    ]);

    // Add marks table
    doc.autoTable({
      startY: 105,
      head: [['Subject Code', 'Subject Name', 'Marks', 'Total Marks', 'Average']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [40, 53, 147],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      margin: { top: 105 }
    });

    // Add summary section
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Term Summary', 14, finalY);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Marks: ${termData.total}`, 14, finalY + 10);
    doc.text(`Average: ${termData.average}`, 14, finalY + 20);
    doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 14, finalY + 30);

    // Save the PDF
    doc.save(`${student.name}_${termName}_Term_Report.pdf`);
  };

  const firstTerm = calculateTermStats('firstTerm');
  const secondTerm = calculateTermStats('secondTerm');
  const thirdTerm = calculateTermStats('thirdTerm');

  // Term Report Card Component
  const TermReportCard = ({ termData, termName, termNumber }) => (
    <Card className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-700">{termNumber} Term</h3>
        
        <div className="flex items-center space-x-4">
          <Badge color="success" size="lg" className="px-4 py-1.5">
            Total: {termData.total}
          </Badge>
          <Badge color="info" size="lg" className="px-4 py-1.5">
            Average: {termData.average}
          </Badge>
          <Button 
            size="sm" 
            gradientDuoTone="cyanToBlue" 
            onClick={() => generateTermReport(termData, termName, studentData)}
            className="flex items-center"
          >
            <HiDownload className="mr-2" />
            Download Report
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table hoverable className="w-full">
          <Table.Head className="bg-gray-100">
            <Table.HeadCell className="text-lg font-semibold text-gray-700 py-3">Subject ID</Table.HeadCell>
            <Table.HeadCell className="text-lg font-semibold text-gray-700 py-3">Subject Name</Table.HeadCell>
            <Table.HeadCell className="text-lg font-semibold text-gray-700 py-3">Marks</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {termData.subjects.length > 0 ? (
              termData.subjects.map((subject, index) => (
                <Table.Row key={`${termName.toLowerCase()}-${index}`} className="hover:bg-gray-50">
                  <Table.Cell className="text-base py-4">{subject.subjectId}</Table.Cell>
                  <Table.Cell className="text-base py-4 font-medium">{subject.subjectName}</Table.Cell>
                  <Table.Cell className="text-base py-4">
                    <span className={`px-3 py-1 rounded-full ${subject.mark >= 75 ? 'bg-green-100 text-green-800' : subject.mark >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
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
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <HiChartBar className="mr-2 text-blue-600" />
        Academic Performance
      </h2>

      <TermReportCard termData={firstTerm} termName="First" termNumber="1st" />
      <TermReportCard termData={secondTerm} termName="Second" termNumber="2nd" />
      <TermReportCard termData={thirdTerm} termName="Third" termNumber="3rd" />
    </div>
  );
}