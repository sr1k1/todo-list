// Form element imports
import TodoForm from ".././features/TodoList/TodoForm.jsx";
import TodoList from ".././features/TodoList/TodoList.jsx";
import TodosViewForm from ".././features/TodoList/TodosViewForm.jsx";

function TodosPage({ todoState, addTodo, completeTodo, updateTodo }) {
  return (
    <>
      <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />
      <TodoList
        todoList={todoState.todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={todoState.isLoading}
      />
      <hr />
      <TodosViewForm
        sortDirection={todoState.sortDirection}
        sortField={todoState.sortField}
        queryString={todoState.queryString}
      />
    </>
  );
}

export default TodosPage;
