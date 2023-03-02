import Stripe from "stripe";
import { ExpressControllerFunction } from "../interfaces";
import { IUser } from "../interfaces/InputType";
import userService from "../services/userService";

const DAY = 24 * 60 * 60 * 1000;

export const stripeController: ExpressControllerFunction = async (req, res) => {
  const { amount, id } = req.body;
  const userId = req.token?.id;

  const { STRIPE_SECRET_KEY } = process.env;

  try {
    if (!STRIPE_SECRET_KEY)
      throw new Error("no stripe secret key provided, check your dotenv");
    if (!userId) throw new Error("no userId in token");

    if (amount !== 5 && amount !== 48)
      throw new Error("invalid amount provided");

    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

    const payment = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "EUR",
      description: "wildcode pro plan purchasing",
      payment_method: id,
      confirm: true,
    });

    if (payment.status === "succeeded") {
      const todayTime = new Date().getTime();

      const [user] = await userService.getById(userId);

      let date_start_subscription: undefined | Date = undefined;
      let date_end_subscription: undefined | Date = undefined;

      const subscriptionTime = amount === 5 ? 30 * DAY : 365 * DAY;

      if (
        !user.date_end_subscription ||
        user.date_end_subscription.getTime() < todayTime
      ) {
        date_start_subscription = new Date(todayTime);
        date_end_subscription = new Date(todayTime + subscriptionTime);
      } else {
        // extend subscription time
        date_start_subscription = user.date_start_subscription || new Date();
        date_end_subscription = new Date(
          user.date_end_subscription.getTime() + subscriptionTime
        );
      }
      const data: IUser = {
        date_end_subscription: date_end_subscription,
        date_start_subscription: date_start_subscription,
        email: user.email,
        password: user.password_hash,
        login: user.login,
      };

      await userService.update(data, userId);

      console.log("payment", payment);

      res.send({
        message: "payment sucessful",
        success: true,
        date_start_subscription,
        date_end_subscription,
      });
    } else throw new Error("payment failed :(");
  } catch (error) {
    console.error(error);

    res.status(500).send("Internal server error");
  }
};
