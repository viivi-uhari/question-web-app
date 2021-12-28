import * as userService from "../../services/userService.js";
import { bcrypt } from "../../deps.js";

//a data object for storing the used email and error messages
//used for populating the email field in the form at login.eta and for showing errors
const getLoginData = async (request) => {
  const body = request.body({ type: "form" });
  const params = await body.value;
  return {
    email: params.get("email"),
    password: params.get("password"),
  }
};

const processLogin = async ({ render, request, response, state }) => {
  const loginData = await getLoginData(request);

  const users = await userService.findUserByEmail(
    loginData.email
  );

  //email not in the database
  if (users.length != 1) {
    render("login.eta", {
      email: loginData.email,
      errors: [("Email address was not found")]
    });
    return;
  }

  const user = users[0];
  const passwordMatches = await bcrypt.compare(loginData.password, user.password);

  //password used doesn't match the one in the database
  if (!passwordMatches) {
    render("login.eta", {
      email: loginData.email,
      errors: [("Incorrect password")]
    });
    return;
  }

  //everything ok!
  await state.session.set("user", user);
  response.redirect("/questions");
};

const showLoginForm = ({ render }) => {
  render("login.eta");
};

export { processLogin, showLoginForm };
