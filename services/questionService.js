import { executeQuery } from "../database/database.js";

const addQuestion = async (title, questionText, userId) => {
  await executeQuery(
    `INSERT INTO questions
      (user_id, title, question_text)
        VALUES ($1, $2, $3)`,
    userId,
    title,
    questionText,
  );
};

const deleteQuestion = async (id) => {
  await executeQuery(
    "DELETE FROM questions WHERE id = $1;",
    id,
  );
};

const addOption = async (questionId, text, correct) => {
  await executeQuery(
    `INSERT INTO question_answer_options
      (question_id, option_text, is_correct)
        VALUES ($1, $2, $3)`,
    questionId,
    text,
    correct,
  );
};

const removeOption = async (id) => {
  await executeQuery(
    "DELETE FROM question_answers WHERE question_answer_option_id = $1;",
    id,
  );
  await executeQuery(
    "DELETE FROM question_answer_options WHERE id = $1;",
    id,
  );
};

//listing questions created by the user
const listUserQuestions = async (userId) => {
  const res = await executeQuery("SELECT * FROM questions WHERE user_id = $1",
    userId,
  );
  return res.rows;
};

//getting a question, whether it is created by the user that has the id 'userId'
const getQuestionByUser = async (questionId, userId) => {
  const res = await executeQuery("SELECT * FROM questions WHERE id = $1 AND user_id = $2",
    questionId,
    userId,
  );
  if (res.rows && res.rows.length > 0) {
    return res.rows[0];
  }
};

const listOptions = async (id) => {
  const res = await executeQuery("SELECT * FROM question_answer_options WHERE question_id = $1",
    id,
  );
  return res.rows;
};

const showQuestion = async (id) => {
  const res = await executeQuery("SELECT * FROM questions WHERE id = $1",
    id,
  );
  if (res.rows && res.rows.length > 0) {
    return res.rows[0];
  }
};

export {
  addQuestion,
  listUserQuestions,
  showQuestion,
  addOption,
  listOptions,
  removeOption,
  deleteQuestion,
  getQuestionByUser,
};
