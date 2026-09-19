import { useState } from "react";
import "./App.css";

function App() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(() => {
  const savedHistory = localStorage.getItem("codesos-history");
  return savedHistory ? JSON.parse(savedHistory) : [];
});

    function loadExample(type) {
    if (type === "NameError") {
      setCode('name = "Riya"\nprint(username)');
      setError("NameError: name 'username' is not defined");
    }

    if (type === "TypeError") {
      setCode('age = 20\nprint("Age: " + age)');
      setError("TypeError: can only concatenate str and int");
    }

    if (type === "IndexError") {
      setCode("numbers = [10, 20, 30]\nprint(numbers[5])");
      setError("IndexError: list index out of range");
    }

    if (type === "ZeroDivisionError") {
      setCode("a = 10\nb = 0\nprint(a / b)");
      setError("ZeroDivisionError: division by zero");
    }
  }

    function copyFix() {
    if (result?.example) {
      navigator.clipboard.writeText(result.example);
      alert("✅ Corrected code copied!");
    }
  }

  function clearHistory() {
  setHistory([]);
  localStorage.removeItem("codesos-history");
} 

function resetInputs() {
  setCode("");
  setError("");
  setResult(null);
}

  function saveToHistory(title) {
  const newItem = {
    title: title,
    error: error,
    time: new Date().toLocaleTimeString()
  };

  const updatedHistory = [newItem, ...history].slice(0, 10);

  setHistory(updatedHistory);
  localStorage.setItem(
    "codesos-history",
    JSON.stringify(updatedHistory)
  );
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
      saveToHistory("NameError");

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
      saveToHistory("SyntaxError");

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
      saveToHistory("TypeError");

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
      saveToHistory("IndexError");

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
        saveToHistory("ModuleNotFoundError");

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
         saveToHistory("ValueError");
    
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
      saveToHistory("KeyError");

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
      saveToHistory("ZeroDivisionError");

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
          <button className="reset-button" onClick={resetInputs}>
  ↻ Reset
</button>

          <div className="demo-section">
  <p className="demo-title">🧪 Try a demo error</p>

  <div className="demo-buttons">
    <button onClick={() => loadExample("NameError")}>
      NameError
    </button>

    <button onClick={() => loadExample("TypeError")}>
      TypeError
    </button>

    <button onClick={() => loadExample("IndexError")}>
      IndexError
    </button>

    <button onClick={() => loadExample("ZeroDivisionError")}>
      ZeroDivisionError
    </button>
  </div>
</div>

        </div>

        {history.length > 0 && (
  <div className="history-card">

    <div className="history-header">
      <h2>🕘 Recent Errors</h2>

      <button className="clear-history-button" onClick={clearHistory}>
        🗑️ Clear
      </button>
    </div>

   
    <div className="history-list">
      {history.map((item, index) => (
        <div className="history-item" key={index}>
          <div>
            <strong>{item.title}</strong>
            <p>{item.error}</p>
          </div>

          <span>{item.time}</span>
        </div>
      ))}
    </div>

  </div>
)}

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