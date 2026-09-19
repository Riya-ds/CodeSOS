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
  // =========================
  // CODE-ONLY DETECTION
  // =========================

  if (error.trim() === "" && code.trim() !== "") {

    // NameError detection
    if (
      code.includes("print(username)") &&
      !code.includes("username =")
    ) {
      setResult({
        type: "error",
        title: "NameError",
        explanation:
          "Your code is trying to use a variable that has not been defined.",
        simple:
          "Python does not know what 'username' means because it was never created.",
        fix:
          "Define the variable before using it, and check that its spelling is correct.",
        prevent:
          "Define variables before using them and keep variable names consistent.",
        example:
          'username = "Riya"\nprint(username)'
      });

      saveToHistory("NameError");
      return;
    }

    // ZeroDivisionError detection
    if (
      code.includes("/ 0") ||
      code.includes("/0") ||
      (code.includes("b = 0") && code.includes("/ b"))
    ) {
      setResult({
        type: "error",
        title: "ZeroDivisionError",
        explanation:
          "Your code tried to divide a number by zero, which Python does not allow.",
        simple:
          "You cannot divide something by 0.",
        fix:
          "Check the divisor and make sure it is not zero.",
        prevent:
          "Validate the divisor before performing division.",
        example:
          "a = 10\nb = 2\nprint(a / b)"
      });

      saveToHistory("ZeroDivisionError");
      return;
    }

    // IndexError detection
    if (
      code.includes("[5]") ||
      code.includes("[10]") ||
      code.includes("[100]")
    ) {
      setResult({
        type: "error",
        title: "IndexError",
        explanation:
          "Your code may be trying to access a list position that does not exist.",
        simple:
          "You are asking for an item at a position outside the list.",
        fix:
          "Check the list length and use a valid index.",
        prevent:
          "Check the list length before accessing an index.",
        example:
          "numbers = [10, 20, 30]\nprint(numbers[0])"
      });

      saveToHistory("IndexError");
      return;
    }

    // TypeError detection
    if (
      code.includes('"Age: " + age') ||
      code.includes("'Age: ' + age")
    ) {
      setResult({
        type: "error",
        title: "TypeError",
        explanation:
          "Your code is trying to combine a string with a number.",
        simple:
          "Python cannot directly join text and a number using +.",
        fix:
          "Convert the number to a string before combining it with text.",
        prevent:
          "Check the data types before combining different values.",
        example:
          'age = 20\nprint("Age: " + str(age))'
      });

      saveToHistory("TypeError");
      return;
    }
  }

      // IndentationError detection
    if (
      code.includes("if ") &&
      code.includes("print(") &&
      !code.includes("    print(")
    ) {
      setResult({
        type: "error",
        title: "IndentationError",
        explanation:
          "Python expects the code inside a block to be properly indented.",
        simple:
          "Your code needs the correct spacing before the line inside the if statement.",
        fix:
          "Indent the code inside the block.",
        prevent:
          "Keep the same indentation level for statements inside a block.",
        example:
          'if True:\n    print("Hello")'
      });

      saveToHistory("IndentationError");
      return;
    }

    // AttributeError detection
    if (
      code.includes(".upper") &&
      code.includes("123")
    ) {
      setResult({
        type: "error",
        title: "AttributeError",
        explanation:
          "Your code is trying to use an attribute or method that does not belong to that object.",
        simple:
          "This type of value does not have the method you are trying to use.",
        fix:
          "Check the data type and make sure the method belongs to that object.",
        prevent:
          "Check the type of your variable before using its methods.",
        example:
          'name = "Riya"\nprint(name.upper())'
      });

      saveToHistory("AttributeError");
      return;
    }

    // FileNotFoundError detection
    if (
      code.includes("open(") &&
      code.includes(".txt")
    ) {
      setResult({
        type: "error",
        title: "FileNotFoundError",
        explanation:
          "Python could not find the file your program tried to open.",
        simple:
          "The file you asked Python to open does not exist at that location.",
        fix:
          "Check the filename and file path.",
        prevent:
          "Make sure the file exists and verify the path before opening it.",
        example:
          'file = open("data.txt", "r")'
      });

      saveToHistory("FileNotFoundError");
      return;
    }
    // =========================
  // NOTHING TO ANALYZE
  // =========================

  if (code.trim() === "" && error.trim() === "") {
    setResult({
      type: "warning",
      title: "Nothing to analyze",
      explanation:
        "Please paste your code or error message first.",
      simple:
        "CodeSOS needs something to look at.",
      fix:
        "Paste your code and/or the error you received.",
      example: ""
    });

    return;
  }

  // =========================
  // ERROR MESSAGE DETECTION
  // =========================

  if (error.includes("NameError")) {
    setResult({
      type: "error",
      title: "NameError",
      explanation:
        "Python cannot find a variable or name that your code is trying to use.",
      simple:
        "You used a name that Python does not know.",
      fix:
        "Check the spelling and make sure the variable is defined before using it.",
      prevent:
        "Define variables before using them and keep names consistent.",
      example:
        'username = "Riya"\nprint(username)'
    });

    saveToHistory("NameError");
  }

  else if (error.includes("SyntaxError")) {
    setResult({
      type: "error",
      title: "SyntaxError",
      explanation:
        "Python found something in your code that does not follow its syntax rules.",
      simple:
        "There is a grammar mistake in your code.",
      fix:
        "Check brackets, quotes, colons, indentation, and spelling.",
      prevent:
        "Check syntax carefully and use an editor that highlights errors.",
      example:
        'print("Hello")'
    });

    saveToHistory("SyntaxError");
  }

  else if (error.includes("TypeError")) {
    setResult({
      type: "error",
      title: "TypeError",
      explanation:
        "An operation was performed on an incompatible data type.",
      simple:
        "Python received a type of value that the operation cannot handle.",
      fix:
        "Check the data types and convert them if necessary.",
      prevent:
        "Check the type of your variables before performing operations.",
      example:
        'age = 20\nprint("Age: " + str(age))'
    });

    saveToHistory("TypeError");
  }

  else if (error.includes("IndexError")) {
    setResult({
      type: "error",
      title: "IndexError",
      explanation:
        "Your code tried to access a list position that does not exist.",
      simple:
        "You asked for an item outside the list.",
      fix:
        "Use a valid index within the list range.",
      prevent:
        "Check the list length before accessing an index.",
      example:
        "numbers = [10, 20, 30]\nprint(numbers[0])"
    });

    saveToHistory("IndexError");
  }

  else if (error.includes("ModuleNotFoundError")) {
    setResult({
      type: "error",
      title: "ModuleNotFoundError",
      explanation:
        "Python could not find the module that your code tried to import.",
      simple:
        "Python cannot find the library you asked for.",
      fix:
        "Check the module name and install the required package if necessary.",
      prevent:
        "Check package names carefully and keep dependencies installed.",
      example:
        "import math"
    });

    saveToHistory("ModuleNotFoundError");
  }

  else if (error.includes("ValueError")) {
    setResult({
      type: "error",
      title: "ValueError",
      explanation:
        "A function received a value of the correct type but an inappropriate value.",
      simple:
        "The value itself is not acceptable for this operation.",
      fix:
        "Check the value before passing it to the function.",
      prevent:
        "Validate user input before processing it.",
      example:
        'age = int("20")'
    });

    saveToHistory("ValueError");
  }

  else if (error.includes("KeyError")) {
    setResult({
      type: "error",
      title: "KeyError",
      explanation:
        "Your code tried to access a dictionary key that does not exist.",
      simple:
        "Python could not find that key in the dictionary.",
      fix:
        "Check whether the key exists before accessing it.",
      prevent:
        "Use .get() or check for the key before accessing it.",
      example:
        'user = {"name": "Riya"}\nprint(user.get("age"))'
    });

    saveToHistory("KeyError");
  }

  else if (error.includes("ZeroDivisionError")) {
    setResult({
      type: "error",
      title: "ZeroDivisionError",
      explanation:
        "Your code tried to divide a number by zero.",
      simple:
        "You cannot divide something by 0.",
      fix:
        "Make sure the divisor is not zero before dividing.",
      prevent:
        "Validate the divisor before performing division.",
      example:
        "a = 10\nb = 2\nprint(a / b)"
    });

    saveToHistory("ZeroDivisionError");
  }

  else {
    setResult({
      type: "warning",
      title: "Unknown Error",
      explanation:
        "CodeSOS could not identify this error yet.",
      simple:
        "This error is not currently covered by CodeSOS.",
      fix:
        "Check the traceback and look for the line where the error occurred.",
      prevent:
        "Read the traceback carefully and test your code step by step.",
      example:
        ""
    });

    saveToHistory("Unknown Error");
  }
}

  return (
    <div className="app">
      <div className="container">

        <header className="header">
  <div className="brand-badge">BEGINNER CODING ASSISTANT</div>

  <div className="logo">
  <span className="logo-icon">🆘</span>
  <span className="logo-text">CodeSOS</span>
</div>

  <p className="tagline">
    Turn confusing coding errors into simple fixes.
  </p>

  <div className="header-flow">
    <span>💻 Paste</span>
    <span>→</span>
    <span>🔍 Analyze</span>
    <span>→</span>
    <span>💡 Understand</span>
    <span>→</span>
    <span>🔧 Fix</span>
  </div>
</header>

        <div className="how-it-works">
  <h2>🧠 How CodeSOS Works</h2>

  <p className="how-description">
    Turn confusing coding errors into simple explanations and actionable fixes.
  </p>

  <div className="steps">
    <div className="step">
      <div className="step-number">1</div>
      <h3>Paste</h3>
      <p>Enter your code and error message.</p>
    </div>

    <div className="step-arrow">→</div>

    <div className="step">
      <div className="step-number">2</div>
      <h3>Analyze</h3>
      <p>CodeSOS identifies the error.</p>
    </div>

    <div className="step-arrow">→</div>

    <div className="step">
      <div className="step-number">3</div>
      <h3>Understand</h3>
      <p>Get a beginner-friendly explanation.</p>
    </div>

    <div className="step-arrow">→</div>

    <div className="step">
      <div className="step-number">4</div>
      <h3>Fix</h3>
      <p>See a corrected code example.</p>
    </div>
  </div>
</div>

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