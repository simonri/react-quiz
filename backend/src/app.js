import express from "express";
import config from "./config";
import loaders from "./loaders";
import socket from "socket.io";

const app = express();
loaders({ expressApp: app });

const io = socket(app.listen(config.port));

io.on("connection", socket => {
	socket.on("host-join", data => {
		socket.join(data.pin);
	});
	socket.on("player-joined", data => {
		socket.join(data);
	});
	socket.on("player-add", data => {
		socket
			.to(`${data.selectedPin}`)
			.emit("room-joined", { name: data.nickname, id: socket.id });
	});

	socket.on("question-over", data => {
		socket.to(`${data.pin}`).emit("question-over");
	});

	socket.on("next-question", data => {
		socket.to(`${data.pin}`).emit("next-question");
	});
	socket.on("question-answered", data => {
		socket
			.to(data.pin)
			.emit("player-answer", { name: data.name, answer: data.answer });
	});
	socket.on("sent-info", data => {
		io.to(data.id).emit("sent-info", {
			answeredCorrect: data.answeredCorrect,
			score: data.score
		});
	});
});

// Get
app.get("/api/getquizzes", quizController.getQuizzes);
app.get("/api/getquestions/:id", quizController.getQuestions);
app.get("/api/getquestion/:id", quizController.getQuestion);
app.get("/api/getQuiz/:id", quizController.getQuiz);

// Put
app.put("/api/updatequestion", quizController.updateQuestion);
app.put("/api/updatequiz", quizController.updateQuiz);

// Post
app.post("/api/newquestion", quizController.newQuestion);
app.post("/api/newquiz", quizController.newQuiz);

// Delete
app.delete("/api/deletequiz/:id", quizController.deleteQuiz);
app.delete("/api/deletequestion/:id", quizController.deleteQuestion);
