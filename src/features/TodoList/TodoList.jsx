import TodoListItem from "./TodoListItem";

// React hooks
import { useEffect } from "react";

// React router imports
import { useSearchParams, useNavigate } from "react-router";

import styles from "./TodoList.module.css";

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
  // Create list of filtered todos that only have incomplete tasks.
  const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);

  // ========================= Pagination ========================== //
  // Set navigator
  const navigate = useNavigate();

  // Create search params to navigate through filtered list
  const [searchParams, setSearchParams] = useSearchParams();

  // Set item limit on page
  const itemsPerPage = 15;

  // Set current page number
  // Note the number 10 here is because we work in a base 10 system
  // Also note: we have the fallback of 1 because when we first load
  // the page, there is no page number param.
  const currentPage = parseInt(searchParams.get("page") || 1, 10);

  // Calculate index of first item on page (count starts at 0)
  const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;

  // Calculate index of last item on page
  const indexOfLastTodoOnPage = currentPage * itemsPerPage;
  const indexOfVeryLastTodo = filteredTodoList.length;

  const indexOfLastTodo = Math.min(indexOfLastTodoOnPage, indexOfVeryLastTodo);

  // Based on the displayed page, truncate the list we are displaying on app.
  const displayedTodoList = filteredTodoList.slice(
    indexOfFirstTodo,
    indexOfLastTodo,
  );

  // Calculate total number of pages
  const totalPages = Math.ceil(todoList.length / itemsPerPage);

  // ======================== Pagination Handler Functions ================= //
  function handlePreviousPage() {
    if (currentPage - 1 >= 0) {
      setSearchParams([["page", currentPage - 1]]);
    }
    return;
  }

  function handleNextPage() {
    if (currentPage + 1 <= totalPages) {
      setSearchParams([["page", currentPage + 1]]);
    }
    return;
  }

  // ===================== useEffect to Handle Invalid Current Page ============== //
  useEffect(() => {
    // Examine currentPage to ensure that it is appropriate; if not, navigate back to home
    if (totalPages > 0) {
      if (
        !(typeof currentPage === "number") ||
        currentPage < 0 ||
        currentPage > totalPages
      ) {
        navigate("/");
      }
    }

    return;
  }, [currentPage, totalPages, navigate]);

  return (
    <>
      {filteredTodoList.length === 0 ? (
        isLoading ? (
          <p>Todo list loading...</p>
        ) : (
          <p>Add todo above to get started</p>
        )
      ) : (
        <ul className={styles.ulProps}>
          {displayedTodoList.map((todo) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              onCompleteTodo={onCompleteTodo}
              onUpdateTodo={onUpdateTodo}
            />
          ))}
        </ul>
      )}
      <div className={styles.paginationControls}>
        <button
          onClick={() => {
            handlePreviousPage();
          }}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => {
            handleNextPage();
          }}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
}

export default TodoList;
