import React, { useState, useEffect } from "react";
import { Redirect } from "react-router";
import createPost from "../services/createPost";
import getPosts from "../services/getPosts";

import getUser from "../services/getUser";

import "../styles/Main.css";

export default function Main() {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    getUser().then((response) => {
      if (!response.data.userid) setUser(false);
      setUser(response.data);
    });
  }, []);

  useEffect(() => {
    console.log("getting posts");
    getPosts().then((response) => setPosts(response.data));
  }, []);

  function handleClick() {
    if (title.length !== 0 && content.length !== 0) createPost(title, content);
  }
  return (
    <div class="container">
      {user === false && <Redirect to="/login" />}
      <div>
        <input
          type="text"
          name="title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea name="content" onChange={(e) => setContent(e.target.value)} />
        <button onClick={handleClick}>create post</button>
        {posts.map((post, index) => {
          return <BlogPost userid={post.userid} title={post.title} content={post.content} />;
        })}
      </div>
    </div>
  );
}

function BlogPost(props) {
  return (
    <div>
      <h1>
        {props.userid} {props.title}
      </h1>
      <p>{props.content}</p>
    </div>
  );
}
