import { useState, useRef } from "react";
import styled from "styled-components";

import TextInputWithLabel from "../../shared/TextInputWithLabel";

// Styled Components
const StyledButton = styled.button`
  font-style: none;
  &:disabled {
    font-style: italic;
  }
`;

const StyledForm = styled.form`
  display: flex;
  gap: 10px;
`;

function TodoForm({ onAddTodo, isSaving }) {
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
    <StyledForm onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="todoTitle"
        label="Todo"
        onChange={(event) => {
          setWorkingTodoTitle(event.target.value);
        }}
        ref={todoTitleInput}
        value={workingTodoTitle}
      />
      <StyledButton disabled={workingTodoTitle === ""}>
        {isSaving ? "Saving..." : "Add Todo"}
      </StyledButton>
    </StyledForm>
  );
}

export default TodoForm;
