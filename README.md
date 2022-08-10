# Learn How to make web page like Youtube With nomadcoders

## 상세 정리 page: <a href="https://www.notion.so/Youtube-Clone-Coding-b6af64d2723743f1bb12f3cd74d87ad7" target="_blank">Go to my notion page🚀</a>

### 1. Learn about NodeJS NPM

- What is a nodeJS? (2021.08.08)

### 2. Set up

- Make package.json (2021.08.08)
- Install Express (2021.08.08)
- How to use Babel (more about nodemon) (2021.08.08)

### 3. Introduction To Express

- Learn about Server (request, respond) (2021.08.09)
- Learn Middlewares(2021.08.09)

### 4. ROUTER

-Learn Router (2021.08.10)
(1~4 global router)

1. hmoepage "/"
2. join "/join"
3. login "/login"
4. search "/search"

5. see profile --> user/:id
6. delete "/delete" --> /user/delete
7. edit "/edit" --> /user/edit
8. logout --> /user/logout

9. watch video "/Watch video" --> /video/watch -->/video/:id
10. upload video --> "/video/upload"
11. edit video "/edit video" --> /video/edit --> /video/:id/edit
12. delete video "/delete video" --> /video/delete --> /video/:id/delet

#### router 우리가 작업중인 주제를 기반으로 URL을 위와 같이 그룹화 해준다.

#### code를 작성한 만큼 code를 간결화 하고 정리하는 것에 시간을 들여야 함을 상기해야한다!

1. 각각의 파일을 활용 용도에 맞게 나누어서 분리
2. router와 handler를 분리. handler는 충분히 많이 길어질 수 있다. router는 handler을 사용하는 입장이다. 즉 필요한 handler만을 불러와서 활용하도록 하자. 이때 globalController는 필요가 없다 모든 controller는 user 혹은 video와 연관되기 때문이다.
