import { useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  // Create state variable to store whether a todo item is editable
  const [isEditing, setIsEditing] = useState(false);

  const [workingTitle, setWorkingTitle] = useState(todo.title);

  // Create a function that creates a cancel button when editing mode is on
  function handleCancel() {
    setWorkingTitle(todo.title);
    setIsEditing(false);
    return;
  }

  // Create helper function that gives us ability to modify text in list
  function handleEdit(event) {
    setWorkingTitle(event.target.value);
  }

  function handleUpdate(event) {
    // if isEditing is set to false, exit function
    if (!isEditing) {
      return;
    }

    // Otherwise, prevent default behavior and proceed with updating todo
    event.preventDefault();
    onUpdateTodo({ ...todo, title: workingTitle });

    // Disable editing
    setIsEditing(false);
    return;
  }

  return (
    <li>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <TextInputWithLabel value={workingTitle} onChange={handleEdit} />
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button type="button" onClick={handleUpdate}>
              Update
            </button>
          </>
        ) : (
          <>
            <input
              type="checkbox"
              checked={todo.isCompleted}
              onChange={() => onCompleteTodo(todo.id)}
            />
            <span
              onClick={() => {
                setIsEditing(true);
              }}
            >
              {todo.title}
            </span>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;
