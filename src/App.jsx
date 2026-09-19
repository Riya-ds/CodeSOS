import { useState } from "react";
import "./App.css";

function App() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

    function copyFix() {
    if (result?.example) {
      navigator.clipboard.writeText(result.example);
      alert("✅ Corrected code copied!");
    }
  }
  function analyzeError() {
    if (code.trim() === "" && error.trim() === "") {
      setResult({
        type: "warning",
        title: "Nothing to analyze",
        explanation: "Please paste your code or error message first.",
        simple: "CodeSOS needs something to look at.",
        fix: "Paste your code and/or the error you received.",
        example: ""
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
        prevent: "Define your variables before using them and check the spelling of variable names.",
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
    } else if (error.includes("ValueError")) {
      setResult({
        type: "error",
        title: "ValueError",
        explanation:
          "Python received a value of the correct type, but the value itself is not valid for the operation.",
        simple:
          "Python understands what kind of data you gave it, but the actual value cannot be used this way.",
        fix:
          "Check the value you are passing and make sure it is valid for the operation.",
        example: 'age = int("20")\nprint(age)'
           });
    } else if (error.includes("ValueError")) {
      setResult({
        type: "error",
        title: "ValueError",
        explanation:
          "Python received a value of the correct type, but the value itself is not valid for the operation.",
        simple:
          "Python understands what kind of data you gave it, but the actual value cannot be used this way.",
        fix:
          "Check the value you are passing and make sure it is valid for the operation.",
        example: 'age = int("20")\nprint(age)'
            });
    } else if (error.includes("ValueError")) {
      setResult({
        type: "error",
        title: "ValueError",
        explanation:
          "Python received a value of the correct type, but the value itself is not valid for the operation.",
        simple:
          "Python understands what kind of data you gave it, but the actual value cannot be used this way.",
        fix:
          "Check the value you are passing and make sure it is valid for the operation.",
        example: 'age = int("20")\nprint(age)'
            });
    
    
    } else if (error.includes("KeyError")) {
      setResult({
        type: "error",
        title: "KeyError",
        explanation:
          "Your code tried to access a key in a dictionary that does not exist.",
        simple:
          "You asked the dictionary for a key that it does not have.",
        fix:
          "Check the available dictionary keys or use .get() when the key may be missing.",
        example:
          'student = {"name": "Riya"}\nprint(student.get("age"))'
      });
    } else if (error.includes("ZeroDivisionError")) {
      setResult({
        type: "error",
        title: "ZeroDivisionError",
        explanation:
          "Your code tried to divide a number by zero, which Python does not allow.",
        simple:
          "You cannot divide something by 0.",
        fix:
          "Check the value of the divisor and make sure it is not zero.",
        example:
          "a = 10\nb = 2\nprint(a / b)"
      });
    }else {
      setResult({
        type: "unknown",
      })
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
            💻 Paste your code
          </label>

          <textarea
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder={'Example:\nname = "Riya"\nprint("Hello " + name)'}
            rows="10"
          ></textarea>

          <label className="input-label error-label">
            🚨 Paste your error message
          </label>

          <textarea
            value={error}
            onChange={(event) => setError(event.target.value)}
            placeholder="Example: NameError: name 'username' is not defined"
            rows="6"
          ></textarea>

          <button
            className="analyze-button"
            onClick={analyzeError}
          >
            🔍 Analyze My Code
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

            <h3>🛡️ How to prevent it</h3>
            <p>{result.prevent}</p>

            <h3>💻 Corrected example</h3>

            <pre className="code-box">
              {result.example}
            </pre>
            <button
  className="copy-button"
  onClick={copyFix}
>
  📋 Copy Fix
</button>

          </div>
        )}

      </div>
    </div>
  );
}

export default App;