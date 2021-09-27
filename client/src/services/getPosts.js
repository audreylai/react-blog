import axios from "axios";

export default function getPosts() {
  return axios.get('/api/post/get')
  .then(function (response) {
    console.log(response)
    return response
  })
}