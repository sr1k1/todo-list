import { useState, useEffect } from "react";
import styled from "styled-components";

const StyledForm = styled.form`
  display: flex;
  gap: 30px;
`;

function TodosViewForm({
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
  queryString,
  setQueryString,
}) {
  // Create a local state for the query string
  const [localQueryString, setLocalQueryString] = useState(queryString);

  // Add delay...
  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);

    // Cleanup function to clear the timeout
    return () => {
      clearTimeout(debounce);
    };
  }, [localQueryString, setQueryString]);

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
            setSortField(event.target.value);
          }}
        >
          <option value="createdTime">Time added</option>
          <option value="title">Title</option>
        </select>
        <label htmlFor="Direction">Direction</label>
        <select
          id="Direction"
          onChange={(event) => {
            setSortDirection(event.target.value);
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
