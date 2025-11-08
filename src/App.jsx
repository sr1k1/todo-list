import "./App.css";

const foo = "bar";

console.log(foo);

function App() {
  // Create array of three todos
  const todos = [
    { id: 1, title: "finish assignment" },
    { id: 2, title: "schedule 1-to-1 mentor session" },
    { id: 3, title: "go to sleep" },
  ];

  return (
    <div>
      <h1>ToDo List</h1>
      <ul>
        {todos.map((obj) => (
          <li key={obj.id}>{obj.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
