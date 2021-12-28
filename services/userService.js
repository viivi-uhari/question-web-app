import { executeQuery } from "../database/database.js";

//creating a user during registration
const addUser = async (email, password) => {
  await executeQuery("INSERT INTO users (email, password) VALUES ($1, $2)",
    email,
    password,
  );
};

//used in 'userMiddleware' to create a user to the context
const findUserByEmail = async (email) => {
  const result = await executeQuery(
    "SELECT * FROM users WHERE email = $1",
    email,
  );
  return result.rows;
};

//used during the tests to test the services
const deleteUser = async (id) => {
  await executeQuery("DELETE FROM users WHERE id = $1",
    id,
  );
};

export { addUser, findUserByEmail, deleteUser };
