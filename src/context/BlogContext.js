import React,{useState, useReducer } from 'react';
import createDataContext from './createDataContext'
import jsonServer from '../api/jsonServer';


// const BlogContext = React.createContext();

const blogReducer = (state, action) => {
    switch(action.type) {
        // case 'add_blogpost':
        //     return [
        //         ...state, 
        //         {
        //             id: Math.floor(Math.random() * 99999),
        //             title: action.payload.title,
        //             content: action.payload.content
        //         }
        //     ];
        case 'delete_blogpost': 
            return state.filter((blogPost)=>blogPost.id !== action.payload);
        case 'edit_blogpost':
            return state.map((blogPost) => {
                return blogPost.id === action.payload.id ? action.payload : blogPost;
                // if (blogPost.id === action.payload.id) {
                //     return action.payload;
                // } else {
                //     return blogPost;
                // }
            });
        case 'get_blogposts': 
        return action.payload;
        default:
            return state;
    }
};

const getBlogPosts = dispatch => {
    return async () => {
        const response = await jsonServer.get('/blogposts');

        dispatch({ type: 'get_blogposts', payload: response.data })
    };
}

const addBlogPost = (dispatch) => {
    return async (title, content, callback) => {
        await jsonServer.post('/blogposts', { title, content })
        // dispatch({ type: 'add_blogpost', payload: { title, content} });
        if(callback){
            callback();
        } 
    };
};

const deleteBlogPost = (dispatch) => {
    return async (id) => {
        await jsonServer.delete(`/blogposts/${id}`);

        dispatch({ type: 'delete_blogpost', payload: id });
    };
};

const editBlogPost = (dispatch) => {
    return async(id, title, content, callback) => {
        await jsonServer.put(`/blogposts/${id}`, { title, content });

        dispatch({ type: 'edit_blogpost', payload: { id, title, content } });
        if(callback){
            callback();
        } 
    };
};

export  const { Context, Provider } = createDataContext(
    blogReducer, 
    { addBlogPost, deleteBlogPost, editBlogPost, getBlogPosts },
    []
);



