
const HOST_URL = "http://ec2-43-201-71-106.ap-northeast-2.compute.amazonaws.com";
// const HOST_URL = "http://localhost";

const SERVER_URL = HOST_URL + ":8000/";
const CLIENT_URL = HOST_URL + ":3000/";


const REDIRECT_URI = CLIENT_URL;
const REST_API_KEY = "43f9c4625042bd2d0d174ecf3708b12e";


const BASE_URL = SERVER_URL + "api";
export const API = {
  KAKAO: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`,
  LOGIN: `${BASE_URL}/kakao/callback`,
  USERS: `${BASE_URL}/users`,
  PROJECTS: `${BASE_URL}/projects`,
  MEMBERS: `${BASE_URL}/members`,
  PAYS: `${BASE_URL}/pays`,
  RESULTS: `${BASE_URL}/project-result`,
};
