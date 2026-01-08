# E-Book Viewer Test

E-Book을 웹에서 읽고, 참여자들이 각자 로컬 파일을 읽을 때 읽은 위치(진행도)를 실시간으로 공유할 수 있는지 테스트하기위해 작성함

## 프로젝트 구조

- `epub-test/`: React 프론트엔드 (Vite + TS)
- `socket_server/`: Node.js 소켓 서버 (Express + Socket.io)

## 로컬 실행 가이드

### 1. 소켓 서버 실행 (Terminal 1)

가장 먼저 실시간 통신을 위한 서버를 켜야함

```bash
# 루트 경로에서 시작
cd socket_server
npm install   # 의존성 설치 (최초 1회)
node index.js
```

### 2. 클라이언트 실행 (Terminal 2)

웹 뷰어를 실행함

```bash
# 루트 경로에서 시작
cd epub-test
npm install   # 의존성 설치 (최초 1회)
npm run dev
```
