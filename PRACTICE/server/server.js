const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Инициализация порта с значением по умолчанию
const port = process.env.PORT || 3000; // Объявляем переменную один раз

// Абсолютный путь к папке uploads и к папке с HTML-файлами
const uploadsPath = path.join(__dirname, 'uploads');
const clientPath = path.join(__dirname, '..', 'angular-practice', 'src'); // Абсолютный путь к клиентской части

// Настройка хранилища для загруженных файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsPath); // Папка для хранения загруженных файлов
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Использовать оригинальное имя файла
    }
});

const upload = multer({ storage });

// Создание приложения Express
const app = express();

// Включение CORS
app.use(cors());

// Middleware для обработки JSON и form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Папка для статических файлов
app.use('/uploads', express.static(uploadsPath));
app.use(express.static(clientPath)); // Папка для статики, например, HTML-файлов

// Обработка GET-запроса на главную страницу
app.get('/', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
});

// Обработка POST-запроса на загрузку файлов
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.send({ filePath: `/uploads/${req.file.filename}` });
});

// Обработка POST-запроса на сохранение файлов
app.post('/api/save', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.send({ filePath: `/uploads/${req.file.filename}` });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
