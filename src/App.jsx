import { useState } from "react";

import "./App.css";

import TodoForm from "./features/TodoList/TodoForm.jsx";
import TodoList from "./features/TodoList/TodoList.jsx";

function App() {
  const [todoList, setTodoList] = useState([]);

  // handler function
  function addTodo(title) {
    const newTodo = {
      title,
      id: Date.now(),
      isCompleted: false,
    };

    setTodoList([...todoList, newTodo]);

    return;
  }

  // helper function to complete todos
  function completeTodo(id) {
    const updatedTodos = todoList.map((todo) => {
      return todo.id === id ? { ...todo, isCompleted: true } : todo;
    });

    // Set the list to the new updated Todos
    setTodoList(updatedTodos);
    return;
  }

  return (
    <div>
      <h1>ToDo List</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} />
    </div>
  );
}

export default App;
