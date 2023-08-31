import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout";
import { getAppProps } from "../utils/getAppProps";

export default function TokenTopup() {
  const addTokensHandler = async () => {
    const result = await fetch(`/api/addTokens`, {
      method: "POST",
    });
    const json = await result.json();
    console.log('addTokensHandler: ', json);

    window.location.href = json.session.url;
  }

  return (
    <div className="h-full overwlow-hidden p-4 flex flex-col items-center">
      <h1 className="text-center">Checkout</h1>
      <p className="block max-w-sm mb-5">You will be redirected to the Stripe payment page to gain tokens. With these tokens you can make API calls and generate new posts.</p>
      <button className="btn max-w-sm" onClick={addTokensHandler}>Add tokens</button>
    </div>
  );
};

TokenTopup.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);

    return {
      props
    };
  }
});
