import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const { user } = await getSession(req, res);
  const client = await clientPromise;

  // pass the name of the collection
  const db = client.db("BlogStandard");

  // will create a new user with sub if user is not exist or update existing one
  const userProfile = await db.collection("users").updateOne(
    {
      auth0Id: user.sub,
    },
    {
      $inc: {
        availableTokens: 10,
      },
      $setOnInsert: {
        auth0Id: user.sub,
      },
    },
    {
      upsert: true,
    }
  );

  console.log("🚀 ~ userProfile:", user);

  res.status(200).json({ user });
}
  