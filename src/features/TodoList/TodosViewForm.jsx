// React hooks
import { useState, useEffect, useContext } from "react";

// Context
import { appContext } from "../../App";

// Style
import styled from "styled-components";

const StyledForm = styled.form`
  display: flex;
  gap: 30px;
`;

function TodosViewForm({ sortDirection, sortField, queryString }) {
  // import dispatch and actions from context
  const { dispatch, todoActions } = useContext(appContext);

  // Create a local state for the query string
  const [localQueryString, setLocalQueryString] = useState(queryString);

  // Add delay...
  useEffect(() => {
    const debounce = setTimeout(() => {
      dispatch({ type: todoActions.setQueryString, localQueryString });
    }, 500);

    // Cleanup function to clear the timeout
    return () => {
      clearTimeout(debounce);
    };
  }, [localQueryString, dispatch]); // replaced setQueryString dispatch, which is now the global setter

  return (
    <StyledForm onSubmit={() => preventRefresh}>
      <div>
        <label>Search todos: </label>
        <input
          type="search"
          value={localQueryString}
          onChange={(event) => {
            setLocalQueryString(event.target.value);
          }}
        ></input>
        <button type="button" onClick={() => setLocalQueryString("")}>
          Clear
        </button>
      </div>
      <div>
        <label htmlFor="sortBy">Sort by</label>
        <select
          id="sortBy"
          onChange={(event) => {
            dispatch({ type: todoActions.setSortField, event });
          }}
        >
          <option value="createdTime">Time added</option>
          <option value="title">Title</option>
        </select>
        <label htmlFor="Direction">Direction</label>
        <select
          id="Direction"
          onChange={(event) => {
            dispatch({ type: todoActions.setSortDirection, event });
          }}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </StyledForm>
  );
}

export default TodosViewForm;
