import { bcrypt } from "../../deps.js";
import { validasaur } from "../../deps.js";
import * as userService from "../../services/userService.js";

const registrationValidationRules = {
  email: [validasaur.required, validasaur.isEmail],
  password: [validasaur.required, validasaur.minLength(4)],
};

const getRegistrationData = async (request) => {
  const body = request.body({ type: "form" });
  const params = await body.value;
  return {
    email: params.get("email"),
    password: params.get("password"),
  };
};

//registering a user
const registerUser = async ({ render, request, response, user, state }) => {

  const registrationData = await getRegistrationData(request);
  const [passed, errors] = await validasaur.validate(
    registrationData,
    registrationValidationRules,
  );

  if (passed) {
    await userService.addUser(
      registrationData.email,
      await bcrypt.hash(registrationData.password),
    );
    response.redirect("/auth/login");
  } else {
    render("registration.eta", {
      email: registrationData.email,
      errors,
    });
  }
}

const showRegistrationForm = ({ render }) => {
  render("registration.eta");
};

export { registerUser, showRegistrationForm };
