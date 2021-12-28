import { executeQuery } from "../database/database.js";

const findFiveUsersWithMostAnswers = async () => {
  const res = await executeQuery(
    `SELECT users.email as email, count(question_answers.user_id) as count
     FROM users LEFT JOIN question_answers ON users.id = question_answers.user_id
     GROUP BY users.id
     ORDER BY count DESC
     LIMIT 5;`,
  );
  return res.rows;
};

const nofAnswers = async (userId) => {
  const res = await executeQuery(
    "SELECT * FROM question_answers WHERE user_id = $1;",
    userId,
  );
  if (res.rows) {
    return res.rows.length;
  }
};

const nofCorrectAnswers = async (userId) => {
  const res = await executeQuery(
    "SELECT * FROM question_answers WHERE user_id = $1 AND correct = true;",
    userId,
  );
  if (res.rows) {
    return res.rows.length;
  }
};

//number of answers to the questions created by the current user
const nofAnswersCreatedByUser = async (userId) => {
  const res = await executeQuery(
    `SELECT * FROM question_answers
    JOIN questions ON question_answers.user_id = questions.user_id
    WHERE questions.user_id = $1;`,
    userId,
  );
  if (res.rows) {
    return res.rows.length;
  }
};

export { nofAnswers, nofCorrectAnswers, nofAnswersCreatedByUser, findFiveUsersWithMostAnswers };
