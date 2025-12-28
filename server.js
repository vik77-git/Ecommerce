const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vikram14markiv@gmail.com",  // Replace with your email
    pass: "mjlp mohd yqbh hieg",   // Replace with your email app password
  },
});

app.post("/send-email", (req, res) => {
  const { email } = req.body;

  const mailOptions = {
    from: "vikram14markiv@gmail.com",
    to: email,
    subject: "Your E-Card Download",
    text: "Thank you for your purchase! Please find your E-Card attached.",
    attachments: [
      {
        filename: "BirthdayCard.pdf",
        path: path.join(__dirname, "Download/BirthdayCard.pdf"),
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ success: false, message: "Email failed" });
    }
    res.json({ success: true, message: "Email sent" });
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
