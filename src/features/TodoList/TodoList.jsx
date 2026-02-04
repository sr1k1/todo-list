import TodoListItem from "./TodoListItem";

import styles from "./TodoList.module.css";

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
  // Create list of filtered todos that only have incomplete tasks.
  const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);

  return filteredTodoList.length === 0 ? (
    isLoading ? (
      <p>Todo list loading...</p>
    ) : (
      <p>Add todo above to get started</p>
    )
  ) : (
    <ul className={styles.ulProps}>
      {filteredTodoList.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;
