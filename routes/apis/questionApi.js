import * as quizService from "../../services/quizService.js";

const getQuestionData = async (question) => {
  const options = await quizService.getOptions(question.id);
  const jsonOptions = []

  for (let i = 0; i < options.length; i++) {
    const option = {
      optionId: options[i].id,
      optionText: options[i].option_text,
    }
    jsonOptions.push(option);
  }

  return {
    questionId: question.id,
    questionTitle: question.title,
    questionText: question.question_text,
    answerOptions: jsonOptions,
  }
};

const getQuestion = async ({ response }) => {
  const question = await quizService.getQuestion();
  if (question) {
    response.body = await getQuestionData(question);
  } else {
    response.body = {};
  }
};

const answerQuestion = async ({ request, response }) => {
  const body = request.body({ type: "json" });
  const document = await body.value;
  const questionId = document.questionId;
  const optionId = document.optionId;
  const chosenOption = await quizService.getOption(optionId, questionId);

  const answerData = {
    correct: false
  }
  if (chosenOption) {
    answerData.correct = chosenOption.is_correct
  }

  response.body = answerData;
}

export { getQuestion, answerQuestion };
