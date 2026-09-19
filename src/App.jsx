import { useState } from "react";
import "./App.css";

function App() {
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  function analyzeError() {
    if (error.trim() === "") {
      setResult({
        type: "warning",
        title: "No error entered",
        explanation: "Please paste a coding error first.",
        fix: "Paste your error message into the box above."
      });
      return;
    }

    if (error.includes("NameError")) {
      setResult({
        type: "error",
        title: "NameError",
        explanation:
          "Python cannot find the variable or name you are trying to use.",
        simple:
          "You are using a name that Python has not been introduced to yet.",
        fix: "Make sure the variable is defined before you use it.",
        example: 'name = "Riya"\nprint(name)'
      });
    } else if (error.includes("SyntaxError")) {
      setResult({
        type: "error",
        title: "SyntaxError",
        explanation:
          "Python found a problem with the structure or grammar of your code.",
        simple:
          "Something about the way the code is written is not valid Python.",
        fix:
          "Check brackets, quotes, colons, indentation, and spelling.",
        example: 'if age > 18:\n    print("Adult")'
      });
    } else if (error.includes("TypeError")) {
      setResult({
        type: "error",
        title: "TypeError",
        explanation:
          "Your code is trying to perform an operation using an inappropriate data type.",
        simple:
          "Python expected one kind of data but received another kind.",
        fix: "Check the data types of the values you are using.",
        example: 'age = 20\nprint("Age: " + str(age))'
      });
    } else if (error.includes("IndexError")) {
      setResult({
        type: "error",
        title: "IndexError",
        explanation:
          "You tried to access a position in a list that does not exist.",
        simple:
          "Your list has fewer items than the position you are asking for.",
        fix:
          "Check the list length and make sure the index is within range.",
        example: "numbers = [10, 20, 30]\nprint(numbers[0])"
      });
    } else if (error.includes("ModuleNotFoundError")) {
      setResult({
        type: "error",
        title: "ModuleNotFoundError",
        explanation:
          "Python cannot find a module or package that your program is trying to import.",
        simple:
          "Your code is asking for a package that Python cannot find.",
        fix:
          "Install the missing package or check that the package name is correct.",
        example: "pip install pandas"
      });
    } else {
      setResult({
        type: "unknown",
        title: "Unknown Error",
        explanation:
          "CodeSOS couldn't identify this error yet.",
        simple:
          "This is where our AI-powered analysis will eventually help.",
        fix:
          "Make sure you pasted the complete error message.",
        example: "AI analysis coming next!"
      });
    }
  }

  return (
    <div className="app">
      <div className="container">

        <header className="header">
          <div className="logo">🆘 CodeSOS</div>
          <p className="tagline">
            Your coding error rescue assistant
          </p>
        </header>

        <div className="input-card">

          <label className="input-label">
            Paste your coding error
          </label>

          <textarea
            value={error}
            onChange={(event) => setError(event.target.value)}
            placeholder="Example: NameError: name 'username' is not defined"
            rows="10"
          ></textarea>

          <button
            className="analyze-button"
            onClick={analyzeError}
          >
            🔍 Analyze Error
          </button>

        </div>

        {result && (
          <div className="result-card">

            <h2>🚨 {result.title}</h2>

            <h3>What happened?</h3>
            <p>{result.explanation}</p>

            <h3>🧠 In simple words</h3>
            <p>{result.simple}</p>

            <h3>🔧 How to fix it</h3>
            <p>{result.fix}</p>

            <h3>💻 Example</h3>

            <pre className="code-box">
              {result.example}
            </pre>

          </div>
        )}

      </div>
    </div>
  );
}

export default App;