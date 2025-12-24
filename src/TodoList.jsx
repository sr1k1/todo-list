import TodoListItem from "./TodoListItem";

function TodoList({ todoList, onCompleteTodo }) {
  // Create list of filtered todos that only have incomplete tasks.
  const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);

  return filteredTodoList.length === 0 ? (
    <p>Add todo above to get started</p>
  ) : (
    <ul>
      {filteredTodoList.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;
