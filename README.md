# Kor_En_translator
---
## 한국어 -> 영어 Transformer 번역기

## 주요 기능
- **한국어 -> 영어** Transformer 모델 추론 - https://github.com/paokimsiwoong/transformer_experiments 에서 학습한 모델
- **Attention 시각화** (Altair 히트맵)
- **JWT 인증** (로그인/회원가입)
- **배치 번역** 지원 (여러 문장 동시 처리)

## 기술 스택
Backend: FastAPI + PyTorch + SQLAlchemy + SQLite
Frontend: React 18 + Vite + TypeScript + Tailwind + React Query

ko-en-translator/
├── backend/
│   ├── app/
│   │   ├── \_\_init__.py
│   │   ├── main.py              # FastAPI 엔트리포인트
│   │   ├── api/
│   │   │   ├── \_\_init__.py
│   │   │   └── v1/
│   │   │       ├── \_\_init__.py
│   │   │       └── routes/
│   │   │           ├── \_\_init__.py
│   │   │           ├── auth.py        # /auth 라우터
│   │   │           ├── users.py       # /users 라우터
│   │   │           └── translate.py   # /translate 라우터
│   │   ├── core/
│   │   │   ├── \_\_init__.py
│   │   │   ├── deps.py          # 의존성 정의 및 현재 유저 정보 반환 함수
│   │   │   ├── security.py      # 비밀번호 해시 생성/검증과 JWT 생성/검증
│   │   │   └── config.py        # 설정 (경로, device 등)
│   │   ├── db/
│   │   │   ├── \_\_init__.py
│   │   │   ├── base.py              # 테이블 파이썬 클래스들이 상속할 Base 클래스 정의
│   │   │   ├── session.py           # SQL 종류 지정 및 db 세션 생성 함수 정의
│   │   │   └── models/
│   │   │       ├── \_\_init__.py
│   │   │       └── user.py          # DB안의 users 테이블 데이터에 대응하는 파이썬 클래스 정의
│   │   ├── ml/
│   │   │   ├── \_\_init__.py
│   │   │   ├── blocks.py        # 모델 layer 정의
│   │   │   ├── embeddings.py    # 토큰 임베딩 정의
│   │   │   ├── pe.py            # Positional embedding 정의
│   │   │   ├── transformer.py   # Transforemr 모델 정의
│   │   │   ├── visualize.py     # 추론 과정 attention score 시각화
│   │   │   └── translator.py    # Transformer 로딩 & 추론 래퍼
│   │   ├── schemas/
│   │   │   ├── \_\_init__.py
│   │   │   ├── user.py          # 유저 관련 Pydantic 모델 (요청/응답)
│   │   │   └── translation.py   # 번역 관련 Pydantic 모델 (요청/응답)
│   │   └── services/
│   │       ├── \_\_init__.py
│   │       ├── auth_service.py        # 유저 등록, 검증 로직
│   │       └── translation_service.py # 번역 로직 (전처리/후처리)
│   ├── models/
│   │   └── ko_en_transformer.pt # 학습된 PyTorch 모델 가중치
│   ├── tests/
│   │   ├── \_\_init__.py
│   │   └── test_translate.py    # 간단한 API/서빙 테스트
│   └── config_ex.yaml    # config.yaml 설정 파일 예시
│   
├── frontend/
│   ├── public/                       # 정적 파일 (favicon, 로고 등)
│   ├── src/
│   │   ├── components/               # 재사용 가능한 UI 컴포넌트들
│   │   │   ├── LoginForm.tsx         # 로그인 폼 UI + 로직
│   │   │   ├── RegisterForm.tsx      # 회원가입 폼 UI + 로직
│   │   │   ├── ProtectedRoute.tsx    # 인증 보호 라우터 컴포넌트
│   │   │   └── Dashboard.tsx         # 메인 대시보드 (번역 UI)
│   │   ├── hooks/                    # 커스텀 React 훅들
│   │   │   ├── useAuth.ts            # 인증 상태 + 로그인/로그아웃 로직
│   │   │   └── useTranslate.ts       # 번역 API 호출 + 상태 관리 훅
│   │   ├── services/                 # API 클라이언트
│   │   │   └── api.ts                # Axios 인스턴스 + 토큰 인터셉터 + 타입 정의
│   │   ├── App.tsx                   # 최상위 컴포넌트 (라우터 설정)
│   │   ├── index.css                 # 전역 CSS (Tailwind)
│   │   └── main.tsx                  # React 앱 진입점 (ReactDOM.render)
│   ├── .env_example                  # .env 파일 예시
│   ├── index.html                    # HTML 엔트리포인트 (#root 컨테이너)
│   ├── vite.config.ts                # Vite 빌드/개발 서버 설정 (프록시 등)
│   ├── eslint.config.js              # ESLint 설정 (Flat Config)
│   ├── tsconfig.json                 # TypeScript 루트 설정 (분리 컴파일)
│   │   ├── tsconfig.app.json         # 브라우저 앱용 TS 설정 (src/)
│   │   └── tsconfig.node.json        # Node.js 설정용 TS 설정 (vite.config.ts)
│   └── package.json                  # 프론트엔드 의존성 + 스크립트
│
└── README.md


## 빠른 시작

@@@ yaml파일, .env 파일, 모델 pth 파일(https://github.com/paokimsiwoong/transformer_experiments에서 학습)등 설정 설명 추가하기

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

## API 엔드포인트

POST /api/v1/auth/register           # 회원가입
POST /api/v1/auth/login              # 로그인 (JWT 발급)
POST /api/v1/translate               # 단일 번역 + viz_url
POST /api/v1/translate/batch         # 배치 번역 + 다중 viz_url
GET  /api/v1/translate/health        # 모델 로딩 상태 확인
GET  /api/v1/users/me                # 현재 로그인된 유저 정보 확인
GET  /api/v1/viz/{folder}/{file}     # iframe용 공개 HTML(attention score 시각화 파일)


## TODO
- [X] 유저 등록 및 로그인 - 보안
- [X] viz True 일 경우 attention score 결과 html 보내기
- [ ] docker 사용해보기 (docker-compose로 백/프론트 동시 실행?)
- [X] front 만들기
    - [ ] 토큰 만료 기간 표시 및 만료 시 로그인 풀기, 로그인 연장(토큰 재발급) 버튼 추가
