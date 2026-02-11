const makeOptions = (methodUsed, token, payload = null) => {
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
};

const fetchRecords = async (options, encodeUrl) => {
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

export { makeOptions, fetchRecords };
