import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import Joi from "joi";
import cors from "cors";

dotenv.config();

const app: Express = express();
app.use(express.json());

app.use(cors());

const schema1 = Joi.object().keys({
  email: Joi.string().trim().email().email(),
  firstname: Joi.string().trim().required(),
  lastname: Joi.string().trim().required(),
  message: Joi.string().trim().required().max(700),
  phone: Joi.string().allow(null, ""),
});

const schema2 = Joi.object().keys({
  email: Joi.string().trim().email().email(),
  name: Joi.string().trim().required(),
  message: Joi.string().trim().required().max(700),
  subject: Joi.string(),
});

app.post("/api/contact1", async (req: Request, res: Response) => {
  const { error, value } = schema1.validate(req.body);
  console.log(req.body);

  if (error) {
    console.log(error.message);
    return res.send(error.message);
  } else {
    const { firstname, lastname, email, message, phone } = req.body;

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "kalemmalek123@gmail.com", // generated ethereal user
        pass: "hfvbjduglzilxozy", // generated ethereal password
      },
    });

    try {
      const emailRes = await transporter.sendMail({
        from: email,
        to: "kalemmalek123@gmail.com",
        subject: `Client ${firstname} ${lastname} is interested`,
        html: `<p>You have a new contact form submission</p><br>
        <p><strong>Name: </strong> ${firstname} ${lastname}</p><br>
        <p><strong>Phone: </strong> ${phone}</p><br>
        <p><strong>Message: </strong> ${message}</p><br>
        
        `,
      });

      console.log("message sent", emailRes.messageId);
    } catch (error) {
      console.log(error);
    }

    return res.status(200).json(req.body);
  }
});

app.post("/api/contact2", async (req: Request, res: Response) => {
  const { error, value } = schema2.validate(req.body);
  console.log(req.body);

  if (error) {
    console.log(error.message);
    return res.send(error.message);
  } else {
    const { name, email, message, subject } = req.body;

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "kalemmalek123@gmail.com", // generated ethereal user
        pass: "hfvbjduglzilxozy", // generated ethereal password
      },
    });

    try {
      const emailRes = await transporter.sendMail({
        from: email,
        to: "kalemmalek123@gmail.com",
        subject: `${subject}`,
        html: `<p>You have a new contact form submission</p><br>
          <p><strong>Name: </strong> ${name}</p><br>
          <p><strong>Message: </strong> ${message}</p><br>

          `,
      });

      console.log("message sent", emailRes.messageId);
    } catch (error) {
      console.log(error);
    }

    return res.status(200).json(req.body);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`API is up and running on port ${process.env.PORT}`);
});
