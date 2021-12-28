import { superoak, assertEquals } from "../deps.js";
import { app } from "../app.js";


//Testing the questionApi:

//Should be a json document (even though the question and option don't exist), should not crash
//To test with a real question and its options, modify the 'questionId' and 'optionId' on line 16
//to something that are in the used database
Deno.test({
  name: "POST to /api/questions/answer should return a json document",
  async fn() {
    const testClient = await superoak(app);
    await testClient.post("/api/questions/answer")
      .send('{"questionId": 1,"optionId": 3}')
      .expect(200)
      .expect("Content-Type", new RegExp("application/json"))
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

//Should be a json document (even though there aren't any questions), should not crash
Deno.test({
  name: "GET to /api/questions/random should return a json document",
  async fn() {
    const testClient = await superoak(app);
    await testClient.get("/api/questions/random")
      .expect(200)
      .expect("Content-Type", new RegExp("application/json"))
  },
  sanitizeResources: false,
  sanitizeOps: false,
});


//Testing the registrationController and loginController:

Deno.test({
  name: `POST to /auth/register with valid inputs should not crash the application (status code 302),
         (registering a user again is also a valid input, just redirects to /auth/login)`,
  async fn() {
    const testClient = await superoak(app);
    await testClient.post("/auth/register")
      .send("email=test@test.com&password=password")
      .expect(302)
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "POST to /auth/login with correct credentials should not crash the application (status code 302)",
  async fn() {
    const testClient = await superoak(app);
    await testClient.post("/auth/login")
      .send("email=test@test.com&password=password")
      .expect(302)
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
