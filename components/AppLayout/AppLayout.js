import { useContex, useContext, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { useUser } from "@auth0/nextjs-auth0/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";

import PostContext from "../../context/postContext";
import { Logo } from "../Logo";


export const AppLayout = ({ children, availableTokens, posts: postsFromSSR, postId }) => {
  const { user, error } = useUser();

  const {setPostsFromSSR, posts, getPosts, noMorePosts} = useContext(PostContext);

  useEffect(() => {
    setPostsFromSSR(postsFromSSR);
  }, [postsFromSSR, setPostsFromSSR]);
  
  return (
    <div className="grid grid-cols-[400px_1fr] h-screen max-h-screen">
      <div className="flex flex-col text-white overflow-hidden">
        <div className="bg-slate-800 px-2">
          <Logo />
          <Link href="/post/new" className="btn" aria-label="Redirect to post builder page">
            New post
          </Link>
          <Link
            href="/token-topup"
            className="block mt-2 text-center hover:underline"
            aria-label="Redirect to the token checkout page"
          >
            <FontAwesomeIcon icon={faCoins} className="text-yellow-500" />
            <span className="pl-1">{availableTokens} tokens available</span>
          </Link>
        </div>
        <div className="px-4 flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/post/${post._id}`}
              className={`border border-white/0 block text-ellipsis overflow-hidden whitespace-nowrap my-1 px-2 py-1 bg-white/10 cursor-pointer rounded-sm ${
                postId === post._id ? "bg-white/20 border-white/70" : ""
              }`}
              aria-label={`Redirect to the post page, where post title is ${post.topic}`}
            >
              {post.topic}
            </Link>
          ))}
          {!noMorePosts && (
            <button
              type="button"
              className="hover:underline text-sm text-slate-200 text-center cursor-pointer mt-4 w-full"
              onClick={() =>
                getPosts({ lastPostDate: posts[posts.length - 1].created })
              }
              aria-label="Load more later saved posts"
            >
              Load more posts
            </button>
          )}
        </div>
        <div className="bg-cyan-800 flex items-center gap-2 border-t border-t-black/50 h-20 px-2">
          {error?.message && <div>{error.message}</div>}
          {!!user ? (
            <>
              <div className="min-w-[50px]">
                <Image
                  src={user.picture}
                  alt={user.name}
                  height={50}
                  width={50}
                  className="rounded-full"
                />
              </div>
              <div className="flex-1">
                <div className="font-bold">{user.email}</div>
                <Link className="text-sm" href="/api/auth/logout" aria-label="Logout from site">
                  Logout
                </Link>
              </div>
            </>
          ) : (
            <Link href="/api/auth/login" aria-label="Redirect to the Auth0 login page to sign in">Login</Link>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};
