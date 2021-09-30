import axios from "axios";

export default function createPost(title, content) {
  console.log("Creating post ",title,content)
  return axios.post('/api/post/create', {
    "title": title,
    "content": content
  })
  .then(function (response) {
    return response
  })
}