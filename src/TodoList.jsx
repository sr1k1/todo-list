import TodoListItem from "./TodoListItem";

function TodoList() {
  // Create array of three todos
  const todos = [
    { id: 1, title: "finish assignment" },
    { id: 2, title: "schedule 1-to-1 mentor session" },
    { id: 3, title: "go to sleep" },
  ];

  return (
    <ul>
      {todos.map((todo) => (
        <TodoListItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

export default TodoList;
