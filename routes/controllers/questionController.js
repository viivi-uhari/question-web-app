import * as questionService from "../../services/questionService.js";
import { validasaur } from "../../deps.js";

const questionValidationRules = {
  questionTitle: [validasaur.required, validasaur.minLength(1)],
  questionDescription: [validasaur.required, validasaur.minLength(1)],
};

const optionValidationRules = {
  optionText: [validasaur.required, validasaur.minLength(1)],
};

const getQuestionData = async (request) => {
  const body = request.body({ type: "form" });
  const params = await body.value;
  return {
    questionTitle: params.get("title"),
    questionDescription: params.get("question_text"),
  };
};

//adding a question to the database if the validation does not fail
const addQuestion = async ({ render, request, response, user, state }) => {

  const questionData = await getQuestionData(request);
  const [passed, errors] = await validasaur.validate(
    questionData,
    questionValidationRules,
  );

  if (passed) {
    await questionService.addQuestion(
      questionData.questionTitle,
      questionData.questionDescription,
      user.id,
    );
    response.redirect("/questions");
  } else {
    render("questions.eta", {
      questions: await questionService.listUserQuestions(user.id),
      title: questionData.questionTitle,
      question_text: questionData.questionDescription,
      errors
    });
  }
};

//deleting a question from the database
const deleteQuestion = async ({ response, params }) => {
  const id = params.id;
  await questionService.deleteQuestion(
    id,
  );
  response.redirect("/questions");
};

const getOptionData = async (request) => {
  const body = request.body({ type: "form" });
  const params = await body.value;

  let correct = false;
  if (params.get("is_correct")) {
    correct = true;
  }

  return {
    optionText: params.get("option_text"),
    isCorrect: correct,
  };
};

//adding an option to the database if the validation does not fail
const addOption = async ({ render, request, response, params, user }) => {
  const optionData = await getOptionData(request)
  const id = params.id;

  //the question where the option is liked to be added must be created by the current user
  const question = await questionService.getQuestionByUser(id, user.id);

  const [passed, errors] = await validasaur.validate(
    optionData,
    optionValidationRules,
  );

  if (passed) {
    //if the question isn't created by the current user, no option is added
    if (question) {
      await questionService.addOption(
        id,
        optionData.optionText,
        optionData.isCorrect,
      );
    }
    response.redirect(`/questions/${id}`);
  } else {
    render("question.eta", {
      question: question,
      options: await questionService.listOptions(id),
      option_text: optionData.optionText,
      is_correct: optionData.isCorrect,
      errors
    });
  }
};

//removing an option from the database
const removeOption = async ({ response, params }) => {
  const id = params.optionId;
  await questionService.removeOption(
    id,
  );
  response.redirect(`/questions/${params.questionId}`);
};

//listing the questions created by the user
const listQuestions = async ({ render, user }) => {
  render("questions.eta", {
    questions: await questionService.listUserQuestions(user.id),
  });
};

//showing a specific question
const showQuestion = async ({ render, response, params }) => {
  const id = params.id;
  const question = await questionService.showQuestion(id);
  const options = await questionService.listOptions(id);
  if (question) {
    render("question.eta", { question, options });
  } else {
    //if no question with the specified id, redirect to to /questions
    response.redirect("/questions");
  }
};

export { addQuestion, listQuestions, showQuestion, addOption, removeOption, deleteQuestion };
