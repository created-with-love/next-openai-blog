import React, { useCallback, useReducer, useState } from 'react';
import * as ACTIONS from './constants';

const PostContext = React.createContext({});

export default PostContext;

const postsReducer = (state, {type, posts = [], postId}) => {
    switch(type) {
        case ACTIONS.ADD_POSTS: {
            const newPosts = [...state];
            posts.forEach(post => {
                const exists = newPosts.find((p) => p._id === post._id)
                if (!exists) newPosts.push(post)
            });
    
            return newPosts;
        }

        case ACTIONS.DELETE_POST: {
            const results = [];
            state.forEach(post => {
                if (post._id !== postId) {
                    results.push(post);
                }
            });
            return results;
        }

        default: 
            return state;
    }
}

export const PostsProvider = ({children}) => {
    const [posts, dispatch] = useReducer(postsReducer, []);
    const [noMorePosts, setNoMorePosts] = useState(false);

    const deletePost = useCallback((postId) => {
        dispatch({type: ACTIONS.DELETE_POST, postId});
    }, []);

    const setPostsFromSSR = useCallback((postsFromSSR = []) => {
        dispatch({type: ACTIONS.ADD_POSTS, posts: postsFromSSR});
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

        dispatch({type: ACTIONS.ADD_POSTS, posts: postsResult});
    }, []);

    return <PostContext.Provider value={{posts, setPostsFromSSR, getPosts, noMorePosts, deletePost}}>{children}</PostContext.Provider>
}