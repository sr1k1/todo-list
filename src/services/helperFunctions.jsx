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
  const resp = await fetch(url, options);

  // Throw an error if we don't receive an adequate response
  if (!resp.ok) {
    throw new Error(resp.message);
  }

  // If the above constraints are satisfied, return the records
  const { records } = await resp.json();
  return records;
};

function handleErrorMessage(setErrorMessage, errorMessage) {
  console.log(errorMessage);
  setErrorMessage(errorMessage);
}

export default { makePayload, makeOptions, fetchRecords, handleErrorMessage };
