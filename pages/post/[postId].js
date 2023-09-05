import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";
import { AppLayout } from "../../components/AppLayout";
import clientPromise from "../../lib/mongodb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { getAppProps } from "../../utils/getAppProps";

export default function Post(props) {
  const cleanedTitle = props.title.replace(/<title>|<\/title>/gi, '');
  
  return (
    <div className="overlof-auto h-full">
      <div className="max-w-screen-sm mx-auto pb-6">
        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
            SEO title and meta description
        </div>
        <div className="p-4 my-2 border border-stone-200 rounded-md">
          <div className="text-blue-600 text-2xl font-bold">{cleanedTitle}</div>
          <div className="mt-2">{props.metaDescription}</div>
        </div>

        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
            Keywords
        </div>
        <ul className="flex flex-wrap pt-2 gap-1 list-none my-0">
          {props.keywords.split(",").map(keyword => (
            <li key={keyword} className="p-2 rounded-full bg-slate-800 text-white">
              <FontAwesomeIcon icon={faHashtag} /> {keyword}
            </li>
          ))}
        </ul>

        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
            Blog post
        </div>
        <div dangerouslySetInnerHTML={{__html: props.postContent}}/>
      </div>
    </div>
  );
};

Post.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>
};

// get props for component, withPageAuthRequired - require to be logged in for current page
export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);

    const userSession = await getSession(ctx.req, ctx.res);
    const client = await clientPromise;
    const db = client.db("BlogStandard");
    const user = await db.collection("users").findOne({
      auth0Id: userSession.user.sub
    });
    const post = await db.collection("posts").findOne({
      _id: new ObjectId(ctx.params.postId),
      userId: user._id
    })

    if (!post) {
      return {
        redirect: {
          destination: "/post/new",
          permanent: false
        }
      }
    }

    return {
      props: {
        postContent: post.postContent,
        title: post.title,
        metaDescription: post.metaDescription,
        topic: post.topic,
        keywords: post.keywords,
        ...props
      }
    }
  }
});
