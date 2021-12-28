import { assertEquals, bcrypt } from "../deps.js";
import { executeQuery } from "../database/database.js";
import * as userService from "../services/userService.js";
import * as questionService from "../services/questionService.js";
import * as quizService from "../services/quizService.js";
import * as statisticsService from "../services/statisticsService.js";


//For creating a test user, uncomment the code below:
/*
const testUser = {
  id: 1000,
  email: "testing@testing.com",
  password: await bcrypt.hash("password"),
}
await executeQuery("INSERT INTO users (id, email, password) VALUES ($1, $2, $3);",
  testUser.id,
  testUser.email,
  testUser.password,
);
*/

//Test user used with id = 1000
const userId = 1000;

//Test question and options to test the services' functions:
const testQuestion = {
  id: null
}
const testCorrectOption = {
  id: null
}
const testIncorrectOption = {
  id: null
}


//Testing the questionService's functions:

Deno.test({
  name: "Functions addQuestion, listUserQuestions and deleteQuestion should work as expected",
  async fn () {

    await questionService.addQuestion("Test question", "Does the first unit test pass", userId);
    const newQuestions = await questionService.listUserQuestions(userId);
    const index = newQuestions.length - 1
    const addedQuestion = newQuestions[index];

    //storing the created question's id to delete the question created
    //and to test the functions concerning options
    testQuestion.id = addedQuestion.id;

    assertEquals(addedQuestion.title, "Test question");
    assertEquals(addedQuestion.question_text, "Does the first unit test pass");
    assertEquals(addedQuestion.user_id, userId);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});


Deno.test({
    name: "Functions addOption, listOptions and removeOption should work as expected",
    async fn () {

    await questionService.addOption(testQuestion.id, "This is a test option that is correct", true);
    await questionService.addOption(testQuestion.id, "This is a test option that is incorrect", false);
    const options = await questionService.listOptions(testQuestion.id);

    const lastIndex = options.length - 1
    const correctOption = options[lastIndex - 1];
    const incorrectOption = options[lastIndex];

    //storing the created options' ids to delete them
    testCorrectOption.id = correctOption.id;
    testIncorrectOption.id = incorrectOption.id;

    assertEquals(correctOption.option_text, "This is a test option that is correct");
    assertEquals(correctOption.is_correct, true);
    assertEquals(incorrectOption.option_text, "This is a test option that is incorrect");
    assertEquals(incorrectOption.is_correct, false);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});


//Testing the quizService's functions:

Deno.test({
  name: "Function evaluateAnswer should work as expected when answered with the correct option",
  async fn () {
    //correct answer
    const result = await quizService.getOption(testCorrectOption.id, testQuestion.id);
    //adding the answer to test the functions of statisticsService
    await quizService.addAnswer(userId, testCorrectOption.id, testQuestion.id, true);
    assertEquals(result.is_correct, true);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Function evaluateAnswer should work as expected when answered with an incorrect option",
  async fn () {
    //incorrect answer
    const result = await quizService.getOption(testIncorrectOption.id, testQuestion.id);
    //adding the answer to test the functions of statisticsService
    await quizService.addAnswer(userId, testIncorrectOption.id, testQuestion.id, false);
    assertEquals(result.is_correct, false);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Function getCorrectAnswer should return the correct option",
  async fn () {
    const options = await quizService.getCorrectOptions(testQuestion.id);
    assertEquals(options[0].id, testCorrectOption.id);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});


//Testing the statisticsService's functions:

Deno.test({
  name: "Function evaluateAnswer should work as expected when answered with an incorrect option",
  async fn () {
    const nofAnswers = await statisticsService.nofAnswers(userId);
    assertEquals(nofAnswers, 2);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Function evaluateAnswer should work as expected when answered with an incorrect option",
  async fn () {
    const nofCorrectAnswers = await statisticsService.nofCorrectAnswers(1000);
    assertEquals(nofCorrectAnswers, 1);

    //Last test so let's delete the tests' outcomes and the test user:
    await quizService.deleteAnswer(userId);
    await questionService.removeOption(testCorrectOption.id)
    await questionService.removeOption(testIncorrectOption.id)
    await questionService.deleteQuestion(testQuestion.id);
    await userService.deleteUser(userId);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
