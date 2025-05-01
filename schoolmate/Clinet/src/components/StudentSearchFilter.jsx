import { useState } from "react";
import { Label, TextInput } from "flowbite-react";

export default function StudentSearchFilter({
    searchTerm,
    setSearchTerm,
    filterGrade,
    setFilterGrade,
    filterSection,
    setFilterSection,
    filterGender,
    setFilterGender,
    darkMode
}) {
    return (
        <div
            className="w-full max-w-6xl mt-4 mb-6 p-4 rounded-lg shadow-md"
            style={{ background: darkMode ? "#1E293B" : "#ffffff" }}
        >
            <h2 className="text-lg font-semibold mb-3">🔍 Search & Filter</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search Input */}
                <div>
                    <Label>Search Students</Label>
                    <TextInput
                        type="text"
                        placeholder="Name, Email, or School_Email_provided"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Grade Filter */}
                <div>
                    <Label>Filter by Grade</Label>
                    <select
                        value={filterGrade}
                        onChange={(e) => setFilterGrade(e.target.value)}
                        className="w-full p-2 border rounded-lg bg-transparent text-black"
                    >
                        <option value="">All Grades</option>
                        {Array.from({ length: 13 }, (_, i) => (
                            <option key={i} value={(i + 1).toString()}>
                                {i + 1}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Section Filter */}
                <div>
                    <Label>Filter by Section</Label>
                    <select
                        value={filterSection}
                        onChange={(e) => setFilterSection(e.target.value)}
                        className="w-full p-2 border rounded-lg bg-transparent text-black"
                    >
                        <option value="">All Sections</option>
                        {Array.from({ length: 5 }, (_, i) => (
                            <option key={i} value={String.fromCharCode(65 + i)}>
                                {String.fromCharCode(65 + i)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Gender Filter */}
                <div>
                    <Label>Filter by Gender</Label>
                    <select
                        value={filterGender}
                        onChange={(e) => setFilterGender(e.target.value)}
                        className="w-full p-2 border rounded-lg bg-transparent text-black"
                    >
                        <option value="">All Genders</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            {/* Active Filters Display */}
            {(filterGrade || filterSection || filterGender || searchTerm) && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {filterGrade && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            Grade: {filterGrade}
                            <button
                                onClick={() => setFilterGrade("")}
                                className="ml-1 text-blue-600 hover:text-blue-800"
                            >
                                ×
                            </button>
                        </span>
                    )}
                    {filterSection && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            Section: {filterSection}
                            <button
                                onClick={() => setFilterSection("")}
                                className="ml-1 text-green-600 hover:text-green-800"
                            >
                                ×
                            </button>
                        </span>
                    )}
                    {filterGender && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            Gender: {filterGender}
                            <button
                                onClick={() => setFilterGender("")}
                                className="ml-1 text-green-600 hover:text-green-800"
                            >
                                ×
                            </button>
                        </span>
                    )}
                    {searchTerm && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                            Search: "{searchTerm}"
                            <button
                                onClick={() => setSearchTerm("")}
                                className="ml-1 text-purple-600 hover:text-purple-800"
                            >
                                ×
                            </button>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}