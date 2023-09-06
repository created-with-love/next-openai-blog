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
      return res.status(500).json({ error: 'Something went wrong' });
    }

    switch (event.type) {
      case "payment_intent.succeeded": {
        try {
          const client = new MongoClient(process.env.MONGODB_URI);
          await client.connect();
          const db = client.db('BlogStandard');

          const paymentIntent = event.data.object;
          const auth0Id = paymentIntent.metadata.sub;

          const { value: userProfile } = await db.collection('users').findOneAndUpdate(
            { auth0Id },
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
              returnOriginal: false,
            }
          );

          res.status(200).json({
            received: true,
            userProfile,
          });
        } catch (error) {
          console.log('MONGODB ERROR:', error);
          res.status(500).json({ error: 'Something went wrong' });
        }

        break;
      };

      default: 
        console.log('UNHABDLED EVENT:', event.type);
        res.status(200).json({ received: true });
    }
    res.status(200).json({
        received: true
    })
  } else {
    console.log("method is not allowed: ", req.method);
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default cors(handler);