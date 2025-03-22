import React, { useState } from "react";

const StaffModule = () => {
  const hardcodedQuestions = [
    { id: 1, text: "What is the capital of France?", correctAnswer: "Paris" },
    { id: 2, text: "Solve: 5 + 3", correctAnswer: "8" },
    { id: 3, text: "Who wrote 'Hamlet'?", correctAnswer: "Shakespeare" },
  ];

  const [answers, setAnswers] = useState({});
  const [homework, setHomework] = useState("");
  const [homeworkList, setHomeworkList] = useState([]);
  const [scores, setScores] = useState({});

  const submitAnswer = (id, correctAnswer) => {
    const userAnswer = answers[id] || "";
    setScores({ ...scores, [id]: userAnswer.toLowerCase() === correctAnswer.toLowerCase() ? "Correct" : "Incorrect" });
  };

  const addHomework = () => {
    if (homework.trim()) {
      setHomeworkList([...homeworkList, { text: homework }]);
      setHomework("");
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-xl font-bold">Questionnaire</h2>
        {hardcodedQuestions.map(q => (
          <div key={q.id} className="p-2 border rounded mt-2">
            <p>{q.text}</p>
            <input
              value={answers[q.id] || ""}
              onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
              placeholder="Enter your answer"
              className="border p-2 w-full"
            />
            <button onClick={() => submitAnswer(q.id, q.correctAnswer)} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Submit Answer</button>
            {scores[q.id] && <p className="mt-1">{scores[q.id]}</p>}
          </div>
        ))}
      </div>
      
      <div>
        <h2 className="text-xl font-bold">Assign Homework</h2>
        <textarea value={homework} onChange={(e) => setHomework(e.target.value)} placeholder="Enter homework details" className="border p-2 w-full" />
        <button onClick={addHomework} className="mt-2 bg-green-500 text-white px-4 py-2 rounded">Assign Homework</button>
      </div>
      
      <div>
        <h2 className="text-xl font-bold">Homework List</h2>
        {homeworkList.map((hw, index) => (
          <div key={index} className="p-2 border rounded mt-2">
            <p>{hw.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffModule;
