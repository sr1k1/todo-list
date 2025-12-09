import "./App.css";

import TodoForm from "./TodoForm.jsx";
import TodoList from "./TodoList.jsx";

function App() {
  return (
    <div>
      <h1>ToDo List</h1>
      <TodoForm />
      <TodoList />
    </div>
  );
}

export default App;
