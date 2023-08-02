import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";

export default function NewPost() {
  return (
    <div>
      <h1>New post page</h1>
    </div>
  );
}

// add layour for current page
NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>
};

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {},
  };
});
