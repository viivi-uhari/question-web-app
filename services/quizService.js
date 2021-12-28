import { executeQuery } from "../database/database.js";

//getting a random question from the created questions
const getQuestion = async () => {
  const res = await executeQuery("SELECT * FROM questions;");
  const questions = res.rows;
  const index = Math.floor(Math.random() * questions.length);
  if (questions && questions.length > 0) {
    return questions[index];
  }
};

//getting options for the random question
const getOptions = async (id) => {
  const res = await executeQuery("SELECT * FROM question_answer_options WHERE question_id = $1;",
    id,
  );
  return res.rows;
};

//storing the user's answer
const addAnswer = async (userId, optionId, questionId, answer) => {
  await executeQuery(
    `INSERT INTO question_answers
      (user_id, question_id, question_answer_option_id, correct)
    VALUES ($1, $2, $3, $4);`,
    userId,
    questionId,
    optionId,
    answer
  );
};

//getting the user's chosen option
const getOption = async (optionId, questionId) => {
  const res = await executeQuery(
    `SELECT * FROM question_answer_options
        WHERE id = $1 AND question_id = $2;`,
    optionId,
    questionId,
  );
  if (res.rows && res.rows.length > 0) {
    return res.rows[0];
  }
};

const getCorrectOptions = async (questionId) => {
  const res = await executeQuery(
    `SELECT * FROM question_answer_options
        WHERE question_id = $1 AND is_correct = true;`,
    questionId,
  );
  return res.rows;
};

//deleting anwers
//used for deleting test cases created in the unit tests
const deleteAnswer = async (userId) => {
  await executeQuery("DELETE FROM question_answers WHERE user_id = $1;",
    userId,
  );
};

export { getQuestion, getOptions, getOption, getCorrectOptions, addAnswer, deleteAnswer };
