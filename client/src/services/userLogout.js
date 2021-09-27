import axios from "axios";

export default function userLogout() {
  return axios.get('/api/logout')
  .then(function (response) {
    return response
  })
}