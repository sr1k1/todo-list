import { useState, useEffect } from "react";

import "./App.css";

import TodoForm from "./features/TodoList/TodoForm.jsx";
import TodoList from "./features/TodoList/TodoList.jsx";

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

  // -------------------------------------------------------------------- //

  // --------------- Fetch todos from Airtable --------------- //
  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  useEffect(() => {
    const fetchTodos = async () => {
      // Set isLoading to true; we are fetching data!
      setIsLoading(true);

      // Create object of parameters we will use to identify type of fetch request and
      // send token for valid authorization
      const options = {
        method: "GET",
        headers: {
          Authorization: token,
        },
      };

      // Create try/catch/finally block to handle fetch and raise errors if anything arises
      try {
        const resp = await fetch(url, options);

        // If response is NOT okay, throw an error
        if (!resp.ok) {
          throw new Error(resp.message);
        }
        // If response is okay, proceed and process the API response
        const data = await resp.json();

        // Call the map method on data above to restructure data into how
        // we have defined todos here
        const retrievedTodoList = data.records.map((record) => {
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
        console.log(error.message);
        setErrorMessage(error.message);
        return;
      } finally {
        // The loading process is done, so set isLoading to false!
        setIsLoading(false);
        return;
      }
    };
    fetchTodos();
  }, []);
  // --------------------------------------------------------- //
  // handler functions

  // DISCLAIMER FOR WEEK 9: Because the function below originally accepted titles
  // (and its subsequent function usage assumes a title input), I am going to keep
  // it as such and default isCompleted to false (which also makes sense given that
  // if we are adding the todo to our list, it is an unfinished task).
  const addTodo = async (newTodoTitle) => {
    // Create payload, which is an object that holds a records array with one todo
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
    const options = {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    // Use try/catch/finally logic to push todo onto AirTable
    try {
      setIsSaving(true);

      // Send todo to server using fetch
      const resp = await fetch(url, options);

      // Throw an error if we don't receive an adequate response
      if (!resp.ok) {
        throw new Error(resp.message);
      }

      // Destructure records out of the response
      const { records } = await resp.json();

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
      // Log error and set error message to such
      console.log(error.message);
      setErrorMessage(error.message);
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
    const options = {
      method: "PATCH",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    // Finally, implement the try/catch/finally block
    try {
      // Set isSaving to true
      setIsSaving(true);
      // Send edited todo to server using fetch
      const resp = await fetch(url, options);

      // Throw an error if we don't receive an adequate response
      if (!resp.ok) {
        throw new Error(resp.message);
      }

      // Once the database has been updated, we can update our UI with the changes
      const updatedTodos = todoList.map((todo) => {
        return todo.id === editedTodo.id ? editedTodo : todo;
      });

      // Set the current set of todos to the updated list
      setTodoList(updatedTodos);
    } catch (error) {
      // Log error and set error message to such
      console.log(error.message);
      setErrorMessage(`${error.message}. Reverting todo...`);

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
    const options = {
      method: "PATCH",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    // Finally, implement the try/catch/finally block
    try {
      // Set isSaving to true
      setIsSaving(true);
      // Send completed todo to server using fetch
      const resp = await fetch(url, options);

      // Throw an error if we don't receive an adequate response
      if (!resp.ok) {
        throw new Error(resp.message);
      }

      // Once the database has been updated, we can update our UI with the changes
      const updatedTodos = todoList.map((todo) => {
        return todo.id === id ? { ...todo, isCompleted: true } : todo;
      });

      // Set the list to the new updated Todos
      setTodoList(updatedTodos);
    } catch (error) {
      // Log error and set error message to such
      console.log(error.message);
      setErrorMessage(`${error.message}. Reverting todo...`);

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
    <div>
      <h1>ToDo List</h1>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />
      {errorMessage ? (
        <div>
          <hr />
          <p>{errorMessage}</p>
          <button>Clear</button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default App;
