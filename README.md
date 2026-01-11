# Kor_En_translator
---
## 한국어 -> 영어 Transformer 번역기

### 주요 기능
- **한국어 -> 영어** Transformer 모델 추론 
    - https://github.com/paokimsiwoong/transformer_experiments 에서 학습한 모델
- **Attention 시각화** (Altair 히트맵)
- **JWT 인증** (로그인/회원가입)
- **배치 번역** 지원 (여러 문장 동시 처리)

### 프로젝트 구조
- Backend: FastAPI + PyTorch + SQLAlchemy + SQLite
- Frontend: Vite + TypeScript + Tailwind + React 18 + React Query

ko-en-translator/<br>
├── backend/<br>
│   ├── app/<br>
│   │   ├── \_\_init__.py<br>
│   │   ├── main.py              # FastAPI 엔트리포인트<br>
│   │   ├── api/<br>
│   │   │   ├── \_\_init__.py<br>
│   │   │   └── v1/<br>
│   │   │       ├── \_\_init__.py<br>
│   │   │       └── routes/<br>
│   │   │           ├── \_\_init__.py<br>
│   │   │           ├── auth.py        # /auth 라우터<br>
│   │   │           ├── users.py       # /users 라우터<br>
│   │   │           ├── translate.py   # /translate 라우터<br>
│   │   │           └── viz.py         # /viz 라우터<br>
│   │   ├── core/<br>
│   │   │   ├── \_\_init__.py<br>
│   │   │   ├── deps.py          # 의존성 정의 및 현재 유저 정보 반환 함수<br>
│   │   │   ├── security.py      # 비밀번호 해시 생성/검증과 JWT 생성/검증<br>
│   │   │   └── config.py        # 설정 (경로, device 등)<br>
│   │   ├── db/<br>
│   │   │   ├── \_\_init__.py<br>
│   │   │   ├── base.py              # 테이블 파이썬 클래스들이 상속할 Base 클래스 정의<br>
│   │   │   ├── session.py           # SQL 종류 지정 및 db 세션 생성 함수 정의<br>
│   │   │   └── models/<br>
│   │   │       ├── \_\_init__.py<br>
│   │   │       └── user.py          # DB안의 users 테이블 데이터에 대응하는 파이썬 클래스 정의<br>
│   │   ├── ml/<br>
│   │   │   ├── \_\_init__.py<br>
│   │   │   ├── blocks.py        # 모델 layer 정의<br>
│   │   │   ├── embeddings.py    # 토큰 임베딩 정의<br>
│   │   │   ├── pe.py            # Positional embedding 정의<br>
│   │   │   ├── transformer.py   # Transforemr 모델 정의<br>
│   │   │   ├── visualize.py     # 추론 과정 attention score 시각화<br>
│   │   │   └── translator.py    # Transformer 로딩 & 추론 래퍼<br>
│   │   ├── schemas/<br>
│   │   │   ├── \_\_init__.py<br>
│   │   │   ├── user.py          # 유저 관련 Pydantic 모델 (요청/응답)<br>
│   │   │   └── translation.py   # 번역 관련 Pydantic 모델 (요청/응답)<br>
│   │   └── services/<br>
│   │       ├── \_\_init__.py<br>
│   │       ├── auth_service.py        # 유저 등록, 검증 로직<br>
│   │       └── translation_service.py # 번역 로직 (전처리/후처리)<br>
│   ├── models/<br>
│   │   └── ko_en_transformer.pth # 학습된 PyTorch 모델 가중치<br>
│   ├── pyproject.toml    # 백엔드 필요 패키지 목록<br>
│   ├── uv.lock           # 백엔드 필요 패키지 버전 정보<br>
│   └── config_ex.yaml    # config.yaml 설정 파일 예시<br>
│<br>
├── frontend/<br>
│   ├── public/                       # 정적 파일 (favicon, 로고 등)<br>
│   ├── src/<br>
│   │   ├── components/<br>
│   │   │   ├── LoginForm.tsx         # 로그인 폼 UI + 로직<br>
│   │   │   ├── RegisterForm.tsx      # 회원가입 폼 UI + 로직<br>
│   │   │   ├── ProtectedRoute.tsx    # 인증 보호 라우터 컴포넌트<br>
│   │   │   └── Dashboard.tsx         # 메인 대시보드 (번역 UI)<br>
│   │   ├── hooks/<br>
│   │   │   ├── useAuth.ts            # 인증 상태 + 로그인/로그아웃 로직<br>
│   │   │   └── useTranslate.ts       # 번역 API 호출 + 상태 관리 훅<br>
│   │   ├── services/<br>
│   │   │   └── api.ts                # Axios 인스턴스 + 토큰 인터셉터 + 타입 정의<br>
│   │   ├── App.tsx                   # 최상위 컴포넌트 (라우터 설정)<br>
│   │   ├── index.css                 # 전역 CSS (Tailwind)<br>
│   │   └── main.tsx                  # React 앱 진입점 (ReactDOM.render)<br>
│   ├── .env_example                  # .env 파일 예시<br>
│   ├── index.html                    # HTML 엔트리포인트 (#root 컨테이너)<br>
│   ├── vite.config.ts                # Vite 빌드/개발 서버 설정 (프록시 등)<br>
│   ├── eslint.config.js              # ESLint 설정<br>
│   ├── tsconfig.json                 # TypeScript 루트 설정<br>
│   │   ├── tsconfig.app.json         # 브라우저 앱용 TS 설정 (src/)<br>
│   │   └── tsconfig.node.json        # Node.js 설정용 TS 설정 (vite.config.ts)<br>
│   ├── package.json                  # 프론트엔드 필요 패키지 + 스크립트 정보<br>
│   └── package-lock.json             # 프론트엔드 필요 패키지 버전 정보<br>
│<br>
└── README.md<br>


### 빠른 시작

1. backend 폴더에 config.yaml 파일 생성
    - backend 폴더의 config_ex.yaml 파일 참조
2. frontend 폴더에 .env 파일 생성
    - frontend 폴더의 .env_example 파일 참조
3. config.yaml 파일의 MODEL_PATH 필드에 트랜스포머 pytorch 모델 .pth 파일 위치 입력

4. 서버 실행
```bash
# 백엔드
cd backend
uv sync
uv run -m app.main

# 프론트엔드 (별도 터미널)
cd frontend
npm install
npm run dev
```

### API 엔드포인트

- POST /api/v1/auth/register           # 회원가입
- POST /api/v1/auth/login              # 로그인 (JWT 발급)
- POST /api/v1/translate               # 단일 번역 + viz_url
- POST /api/v1/translate/batch         # 배치 번역 + 다중 viz_url
- GET  /api/v1/translate/health        # 모델 로딩 상태 확인
- GET  /api/v1/users/me                # 현재 로그인된 유저 정보 확인
- GET  /api/v1/viz/{folder}/{file}     # iframe용 공개 HTML(attention score 시각화 파일)


### TODO
- [X] 유저 등록 및 로그인 - 보안
- [X] viz True 일 경우 attention score 결과 html 보내기
- [ ] docker 사용해보기 (docker-compose로 백/프론트 동시 실행?)
