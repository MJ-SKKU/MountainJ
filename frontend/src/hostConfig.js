const EC2_HOST =
  "http://ec2-43-201-71-106.ap-northeast-2.compute.amazonaws.com";
const DOMAIN_HOST = "http://mountainj.me";
const LOCAL_HOST = "http://localhost";

const DJANGO_PORT = 8000;
const REACT_PORT = 3000;

// 개발용 - 개발자 알아서 편집.
const SERVER_URL = LOCAL_HOST + `:${DJANGO_PORT}/`;
const CLIENT_URL = LOCAL_HOST + `:${REACT_PORT}/`;

// 배포용
// const SERVER_URL = DOMAIN_HOST + `:${DJANGO_PORT}/`;
// const CLIENT_URL = DOMAIN_HOST;

const HOST = {
  SERVER_URL: SERVER_URL,
  CLIENT_URL: CLIENT_URL,
};

export default HOST;
