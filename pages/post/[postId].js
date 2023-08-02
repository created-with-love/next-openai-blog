import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default function Post() {
  return (
    <div>
      <h1>Post Page</h1>
    </div>
  );
}

// get props for component, withPageAuthRequired - require to be logged in for current page
export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {},
  };
});
