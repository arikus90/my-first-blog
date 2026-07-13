import express from "express";
import path from "path";
import livereload from "livereload";
import connectLiveReload from "connect-livereload";

const comments = []; // Массив, где будут храниться все добавленные комментарии

const app = express();
const port = 3000;


// Настройка автоматического обновления превью
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(process.cwd(), "public"));
liveReloadServer.watch(path.join(process.cwd(), "views"));

app.use(connectLiveReload());

// Вот эта строка обязательна, чтобы Express открывал index.ejs:
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.json()) // Извлекает имя и текст комментария из JSON-посылки в req.body

app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.get("/about", (req, res) => {
    res.render("about");
});
app.get('/forYou', (req, res) => {
    res.render('forYou');
});

app.post("/add-comment", (req, res) => {
    // Здесь сервер будет принимать и сохранять комментарий
const userName = req.body.name; // Записываем в переменную присланное имя
const userText = req.body.text; // Записываем в переменную присланный текст комментария
// Создаем объект нового комментария
    const newComment = {
        name: userName,
        text: userText
    };
    // Добавляем его в наш массив
    comments.push(newComment);
    // Отправляем весь массив обратно на фронтенд в качестве ответа
    res.json(comments);

console.log(userName, userText); // Выводим их в консоль терминала для проверки
  });

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});

