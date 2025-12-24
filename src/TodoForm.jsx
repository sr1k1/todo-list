import { useRef } from "react";

function TodoForm({ onAddTodo }) {
  // Define ref to allow for refocusing onto field
  const todoTitleInput = useRef("");

  function handleAddTodo(event) {
    event.preventDefault();

    // extract title from input form
    const title = event.target.title.value;

    // pass title into onAddTodo, which will then update todoList
    onAddTodo(title);

    // reset input field value to empty string for fresh input
    event.target.title.value = "";

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
        ref={todoTitleInput}
      ></input>
      <button>Add Todo</button>
    </form>
  );
}

export default TodoForm;
