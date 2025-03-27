export function filterStudents(students, searchTerm, filterGrade, filterSection) {
    return students.filter(student => {
        const matchesSearch = searchTerm === "" ||
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.personalEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());

        // Convert both student grade and filter grade to strings for consistent comparison
        const studentGrade = student.grade?.toString() || "";
        const currentFilterGrade = filterGrade.toString();

        const matchesGrade = filterGrade === "" ||
            studentGrade === currentFilterGrade;

        const matchesSection = filterSection === "" ||
            student.section === filterSection;

        return matchesSearch && matchesGrade && matchesSection;
    });
}