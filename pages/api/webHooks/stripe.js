import Cors from 'micro-cors';
import stripeInit from 'stripe';
import verifyStripe from '@webdeveducation/next-verify-stripe';
import { MongoClient } from 'mongodb';


const cors = Cors({
    allowMethods: ['POST', 'HEAD']
});

export const config = {
    api: {
        bodyParser: false
    }
};

const stripe = stripeInit(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const handler = async (req, res) => {
  if (req.method === "POST") {
    let event;

    try {
      event = await verifyStripe({req, stripe, endpointSecret});
    } catch (e) {
      console.log("ERROR:", e);
    }

    switch (event.type) {
      case "payment_intent.succeeded": {
        const client = new MongoClient(process.env.MONGODB_URI);
        global.mongoClientPromise = client.connect();
        const db = client.db("BlogStandard");

        const paymentIntent = event.data.object;
        const auth0Id = paymentIntent.metadata.sub;
        console.log("🚀 ~ auth0Id:", auth0Id)

        const userProfile = await db.collection("users").updateOne(
          {
            auth0Id,
          },
          {
            $inc: {
              availableTokens: 10,
            },
            $setOnInsert: {
              auth0Id,
            },
          },
          {
            upsert: true,
          }
        );
      };

      default: 
        console.log('UNHABDLED EVENT:', event.type)
    }
    res.status(200).json({
        received: true
    })
  }
};

export default cors(handler);