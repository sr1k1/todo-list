// React hooks
import { useState, useEffect, useCallback, useReducer } from "react";

// App components
import TodoForm from "./features/TodoList/TodoForm.jsx";
import TodoList from "./features/TodoList/TodoList.jsx";
import TodosViewForm from "./features/TodoList/TodosViewForm.jsx";

// Reducer components
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from "./reducers/todos.reducer.js";

// Style
import "./App.css";
import styles from "./App.module.css";

// --------------- Fetch todos from Airtable --------------- //
const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

function App() {
  // --------------- State variables and updater functions --------------- //

  // todoList, isLoading, errorMessage, isSaving
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

  // State variables storing the selected field and direction of sorting todos
  const [sortField, setSortField] = useState("createdTime");
  const [sortDirection, setSortDirection] = useState("desc");

  // State variable storing search query
  const [queryString, setQueryString] = useState("");

  // ---------------- Variables ------------------ //

  // Use useCallback to optimize encodeUrl
  // Define utility function that encodes parameters needed to sort todos and update the above url
  const encodeUrl = useCallback(() => {
    // Create variable that will create the component of the query that will search based on keyword, ONLY
    // if a queryString is provided
    let searchQuery = "";

    // Create the component of the query that deals with sorting the todos based on field and direction
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;

    // If a queryString is passed in, update searchQuery with the appropriate keywords
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
    }
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [sortField, sortDirection, queryString]);

  // ---------------- Helper Functions ----------------------------- //

  function makeOptions(methodUsed, payload = null) {
    const options = {
      method: methodUsed,
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    };

    // If payload is specified, add it to options
    if (payload) {
      options.body = JSON.stringify(payload);
    }

    // Return options!
    return options;
  }

  const fetchRecords = async (options) => {
    // Send completed todo to server using fetch
    const resp = await fetch(encodeUrl(), options);

    // Throw an error if we don't receive an adequate response
    if (!resp.ok) {
      throw new Error(resp.message);
    }

    // If the above constraints are satisfied, return the records
    const { records } = await resp.json();
    return records;
  };

  function handleErrorMessage(errorMessage) {
    dispatch({ type: todoActions.setLoadError, error: errorMessage });
  }
  // ---------------- Effects ------------------------- //

  useEffect(() => {
    const fetchTodos = async () => {
      // Set isLoading to true via dispatch; we are fetching data!
      dispatch({ type: todoActions.fetchTodos });

      // Create options object with "GET" method
      const options = makeOptions("GET");

      // Create try/catch/finally block to handle fetch and raise errors if anything arises
      try {
        // Retrieve records from API
        const records = await fetchRecords(options);

        // Load todos into app
        dispatch({ type: todoActions.loadTodos, records });
      } catch (error) {
        handleErrorMessage(error.message);
        return;
      }
    };
    fetchTodos();
  }, [sortDirection, sortField, queryString]);
  // --------------------------------------------------------- //
  // handler functions

  const addTodo = async (newTodoTitle) => {
    // Create payload, which here is an object that holds a records array with one todo
    const payload = {
      records: [
        {
          fields: {
            title: newTodoTitle,
            isCompleted: false,
          },
        }, // Holds one todo
      ],
    };

    // Create an options object to hold parameters needed to push data into AirTable
    const options = makeOptions("POST", payload);

    // Use try/catch/finally logic to push todo onto AirTable
    try {
      // Start request by setting isSaving to true
      dispatch({ type: todoActions.startRequest });

      // Obtain records from data
      const records = await fetchRecords(options);

      // Display added todo on UI
      dispatch({ type: todoActions.addTodo, records });
    } catch (error) {
      handleErrorMessage(error.message);
    } finally {
      // Set isSaving and isLoading to false.
      dispatch({ type: todoActions.endRequest });
    }

    return;
  };

  const updateTodo = async (editedTodo) => {
    // Find and save the original Todo by iterating through the todoList
    // with the Id of interest
    const originalTodo = todoState.todoList.find((todo) => {
      return todo.id === editedTodo.id;
    });

    // Create payload object using the edited todo to be updated into the database
    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };

    // Create options object with "PATCH" method
    const options = makeOptions("PATCH", payload);

    // Finally, implement the try/catch/finally block
    try {
      // Set isSaving to true
      dispatch({ type: todoActions.startRequest });

      // Obtain records and check for errors
      const records = await fetchRecords(options);

      // Update UI with updated todos
      dispatch({ type: todoActions.updateTodo, editedTodo });
    } catch (error) {
      handleErrorMessage(error.message);

      // Revert todos on UI in event of an error
      dispatch({ type: todoActions.revertTodo, originalTodo });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }

    return;
  };

  // helper function to complete todos
  const completeTodo = async (id) => {
    // Find and save the original Todo by iterating through the todoList
    // with the Id of interest
    const originalTodo = todoState.todoList.find((todo) => {
      return todo.id === id;
    });

    // Create payload object using the complete todo to be updated into the database
    const payload = {
      records: [
        {
          id: id,
          fields: {
            title: originalTodo.title,
            isCompleted: true,
          },
        },
      ],
    };

    // Create options object with "PATCH" method
    const options = makeOptions("PATCH", payload);

    // Finally, implement the try/catch/finally block
    try {
      // Set isSaving to true
      dispatch({ type: todoActions.startRequest });

      const records = await fetchRecords(options);

      // Update UI with all todos (including completed ones)
      dispatch({ type: todoActions.completeTodo, id });
    } catch (error) {
      handleErrorMessage(error.message);

      // Create a reverted todos list using the original todo
      dispatch({ type: todoActions.revertTodo, originalTodo });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }

    return;
  };

  return (
    <div className={styles.appOrientation}>
      <div>
        <h1>ToDo List</h1>
        <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />
        <TodoList
          todoList={todoState.todoList}
          onCompleteTodo={completeTodo}
          onUpdateTodo={updateTodo}
          isLoading={todoState.isLoading}
        />
        <hr />
        <TodosViewForm
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          sortField={sortField}
          setSortField={setSortField}
          queryString={queryString}
          setQueryString={setQueryString}
        />
        {todoState.errorMessage ? (
          <div className={styles.errorMessage}>
            <hr />
            <p>{todoState.errorMessage}</p>
            <button
              onClick={() => {
                dispatch({ type: todoActions.clearError });
              }}
            >
              Clear
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default App;
