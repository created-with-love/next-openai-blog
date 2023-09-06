import React, { useCallback, useState } from 'react';

const PostContext = React.createContext({});

export default PostContext;

export const PostsProvider = ({children}) => {
    const [posts, setPosts] = useState([]);
    const [noMorePosts, setNoMorePosts] = useState(false);

    const deletePost = useCallback((postId) => {
        setPosts(postsArray => {
            const results = [];
            postsArray.forEach(post => {
                if (post._id !== postId) {
                    results.push(post);
                }
            });
            return results;
        });
    }, []);

    const setPostsFromSSR = useCallback((postsFromSSR = []) => {
        setPosts(value => {
            const newPosts = [...value];
            postsFromSSR.forEach(post => {
                const exists = newPosts.find((p) => p._id === post._id)
                if (!exists) newPosts.push(post)
            });
    
            return newPosts;
        });
    }, []);

    const getPosts = useCallback(async ({lastPostDate, getNewerPosts = false}) => {
        const result = await fetch(`/api/getPosts`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({lastPostDate, getNewerPosts})
        });

        const json = await result.json();
        const postsResult = json.posts || [];

        if (postsResult.length < 5) {
            setNoMorePosts(true);
        }

        setPosts(value => {
            const newPosts = [...value];
            postsResult.forEach(post => {
                const exists = newPosts.find((p) => p._id === post._id)
                if (!exists) newPosts.push(post)
            });
    
            return newPosts;
        });

    }, []);

    return <PostContext.Provider value={{posts, setPostsFromSSR, getPosts, noMorePosts, deletePost}}>{children}</PostContext.Provider>
}