import axios from "axios";

export default function userLogin(uid, pass) {
  return axios.post('/api/login', { userid: uid, passwd: pass });
}