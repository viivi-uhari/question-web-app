5.12.2021

# Web App for Creating and Answering Questions

This application has been created as a part of a course at Aalto University.

With this application you can create questions, answer them
and see some statistics about them.
You can add multiple wrong and multiple correct answer options to questions.

Questions are created with requests to paths starting with '/questions',
questions are answered with requests to paths starting with '/quiz'
and statistics can be seen from the path '/statistics'.

To access these paths you need to register and after that log in.
The paths for registration '/auth/register' and logging in '/auth/login'
as well as the welcome page at '/' are accessible even without logging in.



-------------------------------------------------------------------------------
## Creating a database:
-------------------------------------------------------------------------------

The application uses a database that requires four tables:
users, questions, question_answer_options and question_answers.
You can create these tables using the following SQL queries:

***

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password CHAR(60)
);

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(256) NOT NULL,
  question_text TEXT NOT NULL
);

CREATE TABLE question_answer_options (
  id SERIAL PRIMARY KEY,
  question_id INTEGER REFERENCES questions(id),
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false
);

CREATE TABLE question_answers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  question_id INTEGER REFERENCES questions(id),
  question_answer_option_id INTEGER REFERENCES question_answer_options(id),
  correct BOOLEAN DEFAULT false
);

CREATE UNIQUE INDEX ON users((lower(email)));

***

Make sure to add the database’s configuration that you're using
to the file database.js found in the database folder.
Add the configuration to the line 5.
Do this before running the application locally
or before running the tests in the tests folder.



-------------------------------------------------------------------------------
## Running the application:
-------------------------------------------------------------------------------

When in the root of the application
you can run the application locally using the command
'deno run --unstable --allow-all --watch run-locally.js'.
By default, the application launches on the port 7777.



-------------------------------------------------------------------------------
## Testing the application:
-------------------------------------------------------------------------------

To test the application, you can use the tests given in the folder tests.
First go to the correct directory from the root of the application
by using the command 'cd tests'.
Then you can run the tests in the file app_test.js with the command
'deno test --allow-net --allow-read --unstable app_test.js'.


For running the tests in file services_test.js you need to create a test user.
You can do so by uncommenting the lines 10 – 19 in the file services_test.js.
The test user has the id = 1000 and email = testing@testing.com.

If your database already has a user with either of these credentials,
please change them on the lines 11 and 12
and make sure to also change the 'userId' used in the tests on line 24.

After this you can run the tests in services_test.js with the command
'deno test --allow-net --allow-read --unstable services_test.js'.
