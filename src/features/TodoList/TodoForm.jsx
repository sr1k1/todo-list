import { useState, useRef } from "react";

import TextInputWithLabel from "../../shared/TextInputWithLabel";

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
      <TextInputWithLabel
        elementId="todoTitle"
        label="Todo"
        onChange={(event) => {
          setWorkingTodoTitle(event.target.value);
        }}
        ref={todoTitleInput}
        value={workingTodoTitle}
      />
      <button disabled={workingTodoTitle === ""}>Add Todo</button>
    </form>
  );
}

export default TodoForm;
