const config = require("./config");
const axios = require("axios");

const url = config.api;

class Jeopardy {
  constructor() {
    this.questions = [];
    this.points = 0;
  }

  async reset() {
    this.points = 0;
    this.questions = [];
  }

  async start() {
    await this.reset();
    await this.loadQuestions(10, 18);

    for (const question of this.questions) {
      let answers = question["incorrect_answers"];
      answers.push(question["correct_answer"]);

      console.log(question["question"]);
      console.log(answers.join(", "));
      console.log("\n");
    }
  }

  async loadQuestions(amount, category) {
    let axUrl = url + "?amount=" + amount + "&category=" + category;
    const resp = await axios.get(axUrl);
    this.questions = resp.data.results;
  }
}

let jeopardy = new Jeopardy();
jeopardy.start();

