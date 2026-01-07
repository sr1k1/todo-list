import { useState } from "react";

import "./App.css";

import TodoForm from "./features/TodoList/TodoForm.jsx";
import TodoList from "./features/TodoList/TodoList.jsx";

function App() {
  const [todoList, setTodoList] = useState([]);

  // handler functions
  function addTodo(title) {
    const newTodo = {
      title,
      id: Date.now(),
      isCompleted: false,
    };

    setTodoList([...todoList, newTodo]);

    return;
  }

  function updateTodo(editedTodo) {
    const updatedTodos = todoList.map((todo) => {
      return todo.id === editedTodo.id ? editedTodo : todo;
    });

    // Set the current set of todos to the updated list
    setTodoList(updatedTodos);
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
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </div>
  );
}

export default App;
