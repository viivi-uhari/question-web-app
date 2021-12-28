import * as quizService from "../../services/quizService.js";

//a data object for storing the quiz's question and its options
//and the correct option to the question
const data = {
  question: null,
  options: [],
  correctOptions: [],
};

//getting a random question from the created questions
const getQuiz = async ({ response }) => {
  const question = await quizService.getQuestion();
  if (question) {
    const options = await quizService.getOptions(question.id);
    data.question = question;
    data.options = options;
    response.redirect(`/quiz/${question.id}`);
  } else {
    response.redirect("/quiz/empty");
  }
};

//displaying the question gotten by the previous function 'getQuiz'
const showQuiz = async ({ render }) => {
  render("quiz.eta", { data });
};

//evaluating if the user's answer was correct
const evaluateAnswer = async ({ response, params, user }) => {

  const optionId = params.optionId;
  const questionId = params.id;

  //finding out whether the option was correct or not
  const chosenOption = await quizService.getOption(optionId, questionId);

  if (chosenOption && chosenOption.is_correct) { //correct!
    await quizService.addAnswer(user.id, optionId, questionId, "true");
    response.redirect(`/quiz/${questionId}/correct`);

  } else { //incorrect
    await quizService.addAnswer(user.id, optionId, questionId, "false");
    const correctOptions = await quizService.getCorrectOptions(questionId);
    data.correctOptions = correctOptions;
    response.redirect(`/quiz/${questionId}/incorrect`);
  }
};

const showCorrect = async ({ render }) => {
  render("correct.eta");
};

const showIncorrect = async ({ render }) => {
  render("incorrect.eta", { data });
};

export { showQuiz, getQuiz, evaluateAnswer, showCorrect, showIncorrect };
