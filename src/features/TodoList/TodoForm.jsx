import { useState, useRef } from "react";

function TodoForm({ onAddTodo }) {
  // Create state variable for title
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");

  // Define ref to allow for refocusing onto field
  const todoTitleInput = useRef("");

  function handleAddTodo(event) {
    event.preventDefault();

    // pass title into onAddTodo, which will then update todoList
    onAddTodo(workingTodoTitle);

    // reset input field value to empty string for fresh input
    setWorkingTodoTitle("");

    // Regain focus onto the current property of the ref
    todoTitleInput.current.focus();

    return;
  }

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input
        type="text"
        id="todoTitle"
        name="title"
        value={workingTodoTitle}
        onChange={(event) => {
          setWorkingTodoTitle(event.target.value);
        }}
        ref={todoTitleInput}
      ></input>
      <button disabled={workingTodoTitle === ""}>Add Todo</button>
    </form>
  );
}

export default TodoForm;
