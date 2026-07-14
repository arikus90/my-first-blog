import express from "express";
import path from "path";
import livereload from "livereload";
import connectLiveReload from "connect-livereload"; // Исправлено на правильное имя библиотеки, если используется в режиме разработки

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

// Добавление комментария
app.post("/add-comment", (req, res) => {
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

    console.log("Добавлен комментарий:", userName, userText); // Выводим в консоль терминала для проверки
});

// Редактирование комментария
app.post("/edit-comment", (req, res) => {
    const index = req.body.index;
    const newText = req.body.text;

    if (comments[index]) {
        comments[index].text = newText;
        console.log(`Комментарий по индексу ${index} успешно изменен на: ${newText}`);
    }

    res.json(comments);
});

// Удаление комментария
app.post("/delete-comment", (req, res) => {
    const index = req.body.index;

    if (index >= 0 && index < comments.length) {
        comments.splice(index, 1);
        console.log(`Комментарий по индексу ${index} успешно удален`);
    }

    res.json(comments);
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});