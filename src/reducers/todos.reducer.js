// Actions that group state use in App.jsx
const actions = {
  fetchTodos: "fetchTodos",
  loadTodos: "loadTodos",
  setLoadError: "setLoadError",
  startRequest: "startRequest",
  addTodo: "addTodo",
  endRequest: "endRequest",
  updateTodo: "updateTodo",
  completeTodo: "completeTodo",
  revertTodo: "revertTodo",
  clearError: "clearError",
  setSortField: "setSortField",
  setSortDirection: "setSortDirection",
  setQueryString: "setQueryString",
};

// Initial state of grouped state variables
const initialState = {
  todoList: [],
  isLoading: false, // State of data transfer to the AirTable API
  isSaving: false, // Tracks whether todo item is being saved to API
  errorMessage: "", // Error message for data transfer to AirTable API
  sortField: "createdTime", // state variable storing field (time and title)
  sortDirection: "desc", // state variable storing direction (ascending or descending)
  queryString: "", // string used to filter todos
};

// Define reducer that will handle the state changes to the four parameters
function reducer(state = initialState, action) {
  switch (action.type) {
    // ================ Pessimistic UI ================ //
    case actions.fetchTodos:
      // Set isLoading to true; this command begins the process of loading in todos!
      return {
        ...state,
        isLoading: true,
      };
    case actions.loadTodos:
      // Call the map method on fetched data to restructure data into how
      // we have defined todos
      const retrievedTodoList = action.records.map((record) => {
        const todo = {
          id: record.id,
          ...record.fields,
        };

        // isCompleted is either true or "", but we want "" to be set to false.
        // Manually check the truthiness of the record.
        if (!todo.isCompleted) {
          todo.isCompleted = false;
        }

        // Return this version of the todo
        return todo;
      });

      // We are returned the state object, taking note to only update the todoList with the new
      // list (what we've just loaded in from airtable) and ensuring that we communicate to the app
      // that we are no longer loading.
      return {
        ...state,
        todoList: retrievedTodoList,
        isLoading: false,
      };

    case actions.setLoadError:
      // Set isLoading to false because hitting an error means that we cannot do anything further from
      // the server side
      return {
        ...state,
        errorMessage: action.error.message,
        isLoading: false,
      };

    case actions.startRequest:
      return {
        ...state,
        isSaving: true,
      };
    case actions.addTodo:
      // Create todo object from records object, which only holds one object (since
      // we can only add one todo at a time)
      const savedTodo = {
        id: action.records[0].id,
        ...action.records[0].fields,
      };

      // Explicitly set isCompleted to false if it is not true
      if (!action.records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }

      // Add this "new" todo object into existing list of todos, and explicitly set isSaving to false
      // (we're done processing once we've updated the todo object!)
      return {
        ...state,
        todoList: [...state.todoList, savedTodo],
        isSaving: false,
      };
    case actions.endRequest:
      // End of request; server should not be working, and neither should app.
      return {
        ...state,
        isLoading: false,
        isSaving: false,
      };

    // ================ Optimistic UI ================ //
    case actions.updateTodo:
      // Update todoslist with the edited todo via map
      const updatedTodos = state.todoList.map((todo) => {
        return todo.id === action.editedTodo.id ? action.editedTodo : todo;
      });

      // Create an updatedState object to check for whether there was an error
      // when updating the todo.
      const updatedState = {
        ...state,
        todoList: updatedTodos,
      };

      // Add error if present
      if (action.error) {
        updatedState.errorMessage = action.error.message;
      }
      return updatedState;
    case actions.completeTodo:
      // Once the database has been updated, we can update our UI with the changes
      const completedTodos = state.todoList.map((todo) => {
        return todo.id === action.id ? { ...todo, isCompleted: true } : todo;
      });

      // Set todoList to our new set of Todos
      return {
        ...state,
        todoList: completedTodos,
      };

    case actions.revertTodo:
      const revertedTodos = [...state.todoList, action.originalTodo];
      // Set todoList to our original set of Todos
      return {
        ...state,
        todolist: revertedTodos,
      };

    case actions.clearError:
      // Set error message to empty string
      return {
        ...state,
        errorMessage: "",
      };

    // ================ Last of state variables ================ //
    case actions.setSortField:
      // set sortField to whatever is being selected by dropdown
      return {
        ...state,
        sortField: action.event.target.value,
      };
    case actions.setSortDirection:
      // set sortDirection to whatever is being selected by dropdown
      return {
        ...state,
        sortDirection: action.event.target.value,
      };
    case actions.setQueryString:
      // Set queryString to local query string
      return {
        ...state,
        queryString: action.localQueryString,
      };
  }
}

export { initialState, actions, reducer };
