# AIMUP 웹사이트

순수 HTML, CSS, JavaScript로 만든 AIMUP AI 전문강의 사이트입니다. `index.html`을 열어 바로 확인할 수 있으며, 로컬 웹서버 사용을 권장합니다.

## 빠른 실행

```powershell
python -m http.server 4173
```

브라우저에서 `http://localhost:4173`을 엽니다.

## Firebase 연결

1. Firebase Console에서 Web App을 만든 뒤 Authentication의 이메일/비밀번호 로그인을 활성화합니다.
2. Cloud Firestore를 생성합니다.
3. `firebase-config.js`의 빈 값을 Firebase SDK 설정값으로 교체합니다.
4. `.firebaserc`의 `YOUR_FIREBASE_PROJECT_ID`를 실제 프로젝트 ID로 바꿉니다.
5. Firebase CLI 로그인 후 `firebase deploy`를 실행합니다.

설정 전에는 로컬 데모 모드로 동작합니다. 일반 이메일로 로그인하면 회원 대시보드, `gsnmw4@naver.com`으로 로그인하면 관리자 페이지가 열립니다. 데모 비밀번호는 6자 이상이면 됩니다.

운영 환경의 관리자 권한은 클라이언트 이메일 비교가 아니라 Firebase Auth custom claim의 `admin: true`를 사용합니다. `firestore.rules`도 동일한 claim을 검사합니다.

## Firebase MCP

공식 Firebase CLI MCP 서버 설정을 다음 위치에 포함했습니다.

- VS Code/Copilot: `.vscode/mcp.json`
- Firebase Studio: `.idx/mcp.json`

새 세션에서 MCP 서버를 시작하면 이 폴더를 프로젝트 컨텍스트로 사용하고 Authentication과 Firestore 도구를 제공합니다. 최초 실행 시 `npx`가 `firebase-tools@latest`를 내려받을 수 있습니다.

## 주요 파일

- `index.html` — 홈페이지
- `profile-nam-minwoo.png` — 대표 프로필 원본 이미지
- `profile-nam-minwoo-cutout.png` — 배경 제거 및 외곽 정리한 홈페이지용 투명 이미지
- `login.html`, `signup.html` — 인증
- `dashboard.html` — 회원 대시보드
- `admin.html` — 관리자 대시보드
- `styles.css` — 반응형 디자인 시스템
- `app.js` — UI, 인증, 문의 저장
- `firebase-config.js` — Firebase SDK 설정
- `firebase.json`, `firestore.rules` — 배포 및 보안 규칙
- `DESIGN.md` — 디자인 콘셉트와 메뉴 트리
