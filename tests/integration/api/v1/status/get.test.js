test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  // const parseUpdateAt = new Date(responseBody.updated_at).toISOString();
  // expect(responseBody.updated_at).toEqual(parseUpdateAt);

  const date = new Date(responseBody.updated_at);
  expect(date.toString()).not.toBe("Invalid Date");

  expect(responseBody.dependencies.database.version).toEqual("16.11");
  expect(responseBody.dependencies.database.max_connections).toEqual(100);
  expect(responseBody.dependencies.database.opend_connections).toEqual(1);

  // expect(responseBody.dependencies.database.version).toBeDefined();
  // expect(typeof responseBody.dependencies.database.version).toBe("string");
});
