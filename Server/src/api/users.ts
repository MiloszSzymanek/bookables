import express from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import env from "../config/env";
import sendEmail from "../utils/email";
import Module from "module";


/* router.use(express.json());
router.post("/register", async (req, res) => { */
const userRouter = express.Router();

userRouter.use(express.json())
userRouter.post("/register", async (req, res) => {
  try {
    const { email, password, paymentProviders, payoutInformation } = req.body;

    if (!email || !password || !paymentProviders || !payoutInformation)
      return res.send({ success: false, errorId: 1 });

    const newUser = new User({
      "email.address": email,
      password,
      paymentProviders,
      payoutInformation,
    });

    const user = await newUser.save();

    const token = await jwt.sign(
      { id: user._id.toHexString(), "email.address": user.email.address },
      env.SECRET,
      {
        expiresIn: "1d",
      }
    );

    // send an email to the user that just got registered
    sendEmail(user.email.address, token);

    res.send({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      console.error("ERROR:", error);
      return res.send(error.message);
    }

    console.error(error);

    return res.status(500).send("unknown error code");
  }
});

userRouter.get("/emailConfirmation/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const verify = jwt.verify(token, env.SECRET);

    if (typeof verify == "string") {
      return res.sendStatus(400);
    }


    const updatedUser = await User.findByIdAndUpdate(
      verify.id,

      { "email.isConfirmed": true },

      { new: true }
    );

    if (!updatedUser) return res.send({ success: false });

    res.send({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      console.error("ERROR:", error);

      return res.send(error.message);
    }

    console.error(error);

    return res.status(500).send("unknown error code");
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.verifyUser(email, password);

    if (!user) return res.send({ success: false, errorId: 3 });

    const token = await jwt.sign(
      { id: user._id.toHexString(), "email.address": user.email.address },
      env.SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.send({ success: true, token: token });
  } catch (error) {
    if (error instanceof Error) {
      console.error("ERROR:", error);

      return res.send(error.message);
    }

    console.error(error);

    return res.status(500).send("unknown error code");
  }
});


export default userRouter ;
