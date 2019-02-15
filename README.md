# TODO LIST

과제 제출을 위한 repository 입니다.
  
  
## 사용기술
* 백엔드 spring boot, h2 
* 프론트엔드 react, mobx
  

## 준비사항
1. Node.js 설치
2. yarn 또는 npm 설치
3. JAVA 설치 (version 1.8)
  
  
## 테스트 방법
설치가 모두 끝났으면 repository를 clone하고, 해당 디렉토리에서 패키지를 설치한 후 실행합니다.

* 서버
```
cd todoapi
mvn package
java -jar target/todoapi-0.0.1-SNAPSHOT.jar
```

* 클라이언트
```
cd todoclient
yarn install
yarn start
```
dev server가 실행되면 http://localhost:3000/ 으로 접속합니다.

* h2-console
http://localhost:8080/h2-console
Driver Class: org.h2.Driver
JDBC URL: jdbc:h2:mem:testdb
User Name: sa


