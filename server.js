require('dotenv').config();  // Подключение переменных из .env
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware для обработки JSON данных
app.use(bodyParser.json());

// Маршрут для отправки email
app.post("/send-email", (req, res) => {
  const { name, email, phone, comment } = req.body;

  // Конфигурация Nodemailer для отправки через Яндекс Почту
  const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,  // ваш email
      pass: process.env.SMTP_PASS,  // пароль приложения
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.SMTP_USER,  // отправляем на свой же email
    subject: 'Новая заявка с формы обратного звонка',
    text: `Имя: ${name}\nEmail: ${email}\nТелефон: ${phone}\nКомментарий: ${comment}`,
  };

  // Отправляем email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Ошибка при отправке письма:", error);
      return res.status(500).json({ message: "Ошибка при отправке письма", error });
    }
    res.status(200).json({ message: "Письмо успешно отправлено!" });
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
