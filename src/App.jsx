import { useState, useEffect, useCallback } from "react";

import "./App.css";
import styles from "./App.module.css";

import TodoForm from "./features/TodoList/TodoForm.jsx";
import TodoList from "./features/TodoList/TodoList.jsx";
import TodosViewForm from "./features/TodoList/TodosViewForm.jsx";

// --------------- Fetch todos from Airtable --------------- //
const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

function App() {
  // --------------- State variables and updater functions --------------- //
  // Todo List
  const [todoList, setTodoList] = useState([]);

  // State of data transfer to the AirTable API
  const [isLoading, setIsLoading] = useState(false);

  // Error message for data transfer to AirTable API
  const [errorMessage, setErrorMessage] = useState("");

  // Tracks whether todo item is being saved to API
  const [isSaving, setIsSaving] = useState(false);

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
  function makePayload(isCompleted, id = null, todo = null, title = null) {
    // Back out title first if it is not given
    if (!todo) {
      todo = id
        ? todoList.find((todoItem) => {
            return todoItem.id === id;
          })
        : null;
      if (!title) {
        title = todo ? todo.title : title;
      }
    } else {
      title = todo.title;
      id = todo.id;
    }

    // Create payload object using the complete todo to be updated into the database
    const payload = {
      records: [
        {
          fields: {
            title: title,
            isCompleted: isCompleted,
          },
        },
      ],
    };

    // Return the payload!
    return payload;
  }

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
    console.log(errorMessage);
    setErrorMessage(errorMessage);
  }
  // ---------------- Effects ------------------------- //

  useEffect(() => {
    const fetchTodos = async () => {
      // Set isLoading to true; we are fetching data!
      setIsLoading(true);

      // Create options object with "GET" method
      const options = makeOptions("GET");

      // Create try/catch/finally block to handle fetch and raise errors if anything arises
      try {
        // Retrieve records from API
        const records = await fetchRecords(options);

        // Call the map method on data above to restructure data into how
        // we have defined todos here
        const retrievedTodoList = records.map((record) => {
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

        setTodoList(retrievedTodoList);
      } catch (error) {
        handleErrorMessage(error.message);
        return;
      } finally {
        // The loading process is done, so set isLoading to false!
        setIsLoading(false);
        return;
      }
    };
    fetchTodos();
  }, [sortDirection, sortField, queryString]);
  // --------------------------------------------------------- //
  // handler functions

  // DISCLAIMER FOR WEEK 9: Because the function below originally accepted titles
  // (and its subsequent function usage assumes a title input), I am going to keep
  // it as such and default isCompleted to false (which also makes sense given that
  // if we are adding the todo to our list, it is an unfinished task).
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
      setIsSaving(true);

      // Obtain records from data
      const records = await fetchRecords(options);

      // Create todo object from returned records, which only holds one object
      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };

      // Explicitly set isCompleted to false if it is not true
      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }

      // Finally, update todoList with this new todo!
      setTodoList([...todoList, savedTodo]);
    } catch (error) {
      handleErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }

    return;
  };

  const updateTodo = async (editedTodo) => {
    // Find and save the original Todo by iterating through the todoList
    // with the Id of interest
    const originalTodo = todoList.find((todo) => {
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
      setIsSaving(true);

      // Obtain records and check for errors
      const records = await fetchRecords(options);

      // Once the database has been updated, we can update our UI with the changes
      const updatedTodos = todoList.map((todo) => {
        return todo.id === editedTodo.id ? editedTodo : todo;
      });

      // Set the current set of todos to the updated list
      setTodoList(updatedTodos);
    } catch (error) {
      handleErrorMessage(error.message);

      // Create a reverted todos list using the original todo
      const revertedTodos = { ...todoList, originalTodo };

      // Finally, update state to original state
      setTodoList([...revertedTodos]);
    } finally {
      setIsSaving(false);
    }

    return;
  };

  // helper function to complete todos
  const completeTodo = async (id) => {
    // Find and save the original Todo by iterating through the todoList
    // with the Id of interest
    const originalTodo = todoList.find((todo) => {
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
      setIsSaving(true);
      const records = await fetchRecords(options);

      // Once the database has been updated, we can update our UI with the changes
      const updatedTodos = todoList.map((todo) => {
        return todo.id === id ? { ...todo, isCompleted: true } : todo;
      });

      // Set the list to the new updated Todos
      setTodoList(updatedTodos);
    } catch (error) {
      handleErrorMessage(error.message);

      // Create a reverted todos list using the original todo
      const revertedTodos = { ...todoList, originalTodo };

      // Update state to original state
      setTodoList([...revertedTodos]);
    } finally {
      setIsSaving(false);
    }

    return;
  };

  return (
    <div className={styles.appOrientation}>
      <div>
        <h1>ToDo List</h1>
        <TodoForm onAddTodo={addTodo} isSaving={isSaving} />
        <TodoList
          todoList={todoList}
          onCompleteTodo={completeTodo}
          onUpdateTodo={updateTodo}
          isLoading={isLoading}
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
        {errorMessage ? (
          <div className={styles.errorMessage}>
            <hr />
            <p>{errorMessage}</p>
            <button>Clear</button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default App;
