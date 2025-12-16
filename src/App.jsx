import { useState } from "react";

import "./App.css";

import TodoForm from "./TodoForm.jsx";
import TodoList from "./TodoList.jsx";

function App() {
  const [newTodo, setNewTodo] = useState("Play Scrabble");

  return (
    <div>
      <h1>ToDo List</h1>
      <TodoForm />
      <p>{newTodo}</p>
      <TodoList />
    </div>
  );
}

export default App;
