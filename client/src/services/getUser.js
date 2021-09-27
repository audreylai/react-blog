import axios from "axios";

export default function getUser() {
  return axios.get('/api/user')
  .then(function (response) {
    return response
  })
}