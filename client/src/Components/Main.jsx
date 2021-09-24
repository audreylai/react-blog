import React from 'react'
import Sidebar from"./Sidebar.jsx";
import Blog from"./Blog.jsx";

import "../styles/Main.css";

export default function Main() {
  return (
    <div class="container">
      <Sidebar/>
      <Blog/>
    </div>
  )
}
