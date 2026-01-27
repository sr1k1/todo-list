function TodosViewForm({
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
  queryString,
  setQueryString,
}) {
  return (
    <form onSubmit={() => preventRefresh}>
      <div>
        <label>Search todos: </label>
        <input
          type="text"
          value={queryString}
          onChange={(event) => {
            setQueryString(event.target.value);
          }}
        ></input>
        <button type="button" onClick={() => setQueryString("")}>
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
    </form>
  );
}

export default TodosViewForm;
