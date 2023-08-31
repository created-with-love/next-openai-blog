import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Image from "next/image";
import { AppLayout } from "../components/AppLayout";
import { getAppProps } from "../utils/getAppProps";
import SuccessImage from "../public/success.jpg";

export default function Success() {

  return (
    <div className="h-full overwlow-hidden p-4">
      <h1 className="text-green-500">Thank you for your purchase</h1>
      <p>Now, you can make requests to the ChatGPT to create new posts with meta description, SEO-friendly title and detailed content</p>
      <Image src={SuccessImage} alt="Hero" className="max-w-sm m-auto" />
    </div>
  );
};

Success.getLayout = function getLayout(page, pageProps) {
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
