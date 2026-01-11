# Kor_En_translator
---
## 한국어 -> 영어 Transformer 번역기

### 주요 기능
- **한국어 -> 영어** Transformer 모델 추론 
    - https://github.com/paokimsiwoong/transformer_experiments 에서 학습한 
<img width="918" height="814" alt="translate" src="https://github.com/user-attachments/assets/2c8d3129-a29a-458f-bc2c-f5a9d5cf21b0" />
- **Attention 시각화** (Altair 히트맵)
<img width="833" height="917" alt="visualization" src="https://github.com/user-attachments/assets/347dd741-1b6d-4856-af4a-03682dc42faf" />
- **JWT 인증** (로그인/회원가입)
<img width="515" height="559" alt="login" src="https://github.com/user-attachments/assets/cedeac89-6ea2-4709-8f0b-0a7851556dd5" />
<img width="529" height="635" alt="register" src="https://github.com/user-attachments/assets/30054d93-375d-4b7a-bb1d-005ed60f35a7" />
- **배치 번역** 지원 (여러 문장 동시 처리)
<img width="907" height="914" alt="batch" src="https://github.com/user-attachments/assets/b9654304-c305-4859-ad1c-41f0c5106741" />

### 프로젝트 구조
- Backend: FastAPI + PyTorch + SQLAlchemy + SQLite
- Frontend: Vite + TypeScript + Tailwind + React 18 + React Query

ko-en-translator/<br>
├──&nbsp;backend/<br>
│&nbsp;&nbsp;&nbsp;├──&nbsp;app/<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;\_\_init__.py<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;main.py&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;FastAPI&nbsp;엔트리포인트<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;api/<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;\_\_init__.py<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;└──&nbsp;v1/<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──&nbsp;\_\_init__.py<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└──&nbsp;routes/<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──&nbsp;\_\_init__.py<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──&nbsp;auth.py&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;/auth&nbsp;라우터<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──&nbsp;users.py&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;/users&nbsp;라우터<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──&nbsp;translate.py&nbsp;&nbsp;&nbsp;#&nbsp;/translate&nbsp;라우터<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└──&nbsp;viz.py&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;/viz&nbsp;라우터<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;core/<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;\_\_init__.py<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;deps.py&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;의존성&nbsp;정의&nbsp;및&nbsp;현재&nbsp;유저&nbsp;정보&nbsp;반환&nbsp;함수<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;security.py&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;비밀번호&nbsp;해시&nbsp;생성/검증과&nbsp;JWT&nbsp;생성/검증<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;└──&nbsp;config.py&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;설정&nbsp;(경로,&nbsp;device&nbsp;등)<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;db/<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;\_\_init__.py<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;base.py&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;테이블&nbsp;파이썬&nbsp;클래스들이&nbsp;상속할&nbsp;Base&nbsp;클래스&nbsp;정의<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;session.py&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;SQL&nbsp;종류&nbsp;지정&nbsp;및&nbsp;db&nbsp;세션&nbsp;생성&nbsp;함수&nbsp;정의<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;└──&nbsp;models/<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──&nbsp;\_\_init__.py<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└──&nbsp;user.py&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;DB안의&nbsp;users&nbsp;테이블&nbsp;데이터에&nbsp;대응하는&nbsp;파이썬&nbsp;클래스&nbsp;정의<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;ml/<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;\_\_init__.py<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;blocks.py&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;모델&nbsp;layer&nbsp;정의<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;embeddings.py&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;토큰&nbsp;임베딩&nbsp;정의<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;pe.py&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;Positional&nbsp;embedding&nbsp;정의<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;transformer.py&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;Transforemr&nbsp;모델&nbsp;정의<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;visualize.py&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;추론&nbsp;과정&nbsp;attention&nbsp;score&nbsp;시각화<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;└──&nbsp;translator.py&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;Transformer&nbsp;로딩&nbsp;&&nbsp;추론&nbsp;래퍼<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;schemas/<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;\_\_init__.py<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;user.py&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;유저&nbsp;관련&nbsp;Pydantic&nbsp;모델&nbsp;(요청/응답)<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;└──&nbsp;translation.py&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;번역&nbsp;관련&nbsp;Pydantic&nbsp;모델&nbsp;(요청/응답)<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;└──&nbsp;services/<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──&nbsp;\_\_init__.py<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──&nbsp;auth_service.py&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;유저&nbsp;등록,&nbsp;검증&nbsp;로직<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└──&nbsp;translation_service.py&nbsp;#&nbsp;번역&nbsp;로직&nbsp;(전처리/후처리)<br>
│&nbsp;&nbsp;&nbsp;├──&nbsp;models/<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;└──&nbsp;ko_en_transformer.pth&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;학습된&nbsp;PyTorch&nbsp;모델&nbsp;가중치<br>
│&nbsp;&nbsp;&nbsp;├──&nbsp;pyproject.toml&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;백엔드&nbsp;필요&nbsp;패키지&nbsp;목록<br>
│&nbsp;&nbsp;&nbsp;├──&nbsp;uv.lock&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;백엔드&nbsp;필요&nbsp;패키지&nbsp;버전&nbsp;정보<br>
│&nbsp;&nbsp;&nbsp;└──&nbsp;config_ex.yaml&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;config.yaml&nbsp;설정&nbsp;파일&nbsp;예시<br>
│<br>
├──&nbsp;frontend/<br>
│&nbsp;&nbsp;&nbsp;├──&nbsp;public/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;정적&nbsp;파일&nbsp;(&nbsp;로고&nbsp;등)<br>
│&nbsp;&nbsp;&nbsp;├──&nbsp;src/<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;components/<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;LoginForm.tsx&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;로그인&nbsp;폼&nbsp;UI&nbsp;+&nbsp;로직<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;RegisterForm.tsx&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;회원가입&nbsp;폼&nbsp;UI&nbsp;+&nbsp;로직<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;ProtectedRoute.tsx&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;인증&nbsp;보호&nbsp;라우터&nbsp;컴포넌트<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;└──&nbsp;Dashboard.tsx&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;메인&nbsp;대시보드&nbsp;(번역&nbsp;UI)<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;hooks/<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;useAuth.ts&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;인증&nbsp;상태&nbsp;+&nbsp;로그인/로그아웃&nbsp;로직<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;└──&nbsp;useTranslate.ts&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;번역&nbsp;API&nbsp;호출&nbsp;+&nbsp;상태&nbsp;관리&nbsp;훅<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;services/<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;└──&nbsp;api.ts&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;Axios&nbsp;인스턴스&nbsp;+&nbsp;토큰&nbsp;인터셉터&nbsp;+&nbsp;타입&nbsp;정의<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;App.tsx&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;최상위&nbsp;컴포넌트&nbsp;(라우터&nbsp;설정)<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;index.css&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;전역&nbsp;CSS&nbsp;(Tailwind)<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;└──&nbsp;main.tsx&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;React&nbsp;앱&nbsp;진입점&nbsp;(ReactDOM.render)<br>
│&nbsp;&nbsp;&nbsp;├──&nbsp;.env_example&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;.env&nbsp;파일&nbsp;예시<br>
│&nbsp;&nbsp;&nbsp;├──&nbsp;index.html&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;HTML&nbsp;엔트리포인트&nbsp;(#root&nbsp;컨테이너)<br>
│&nbsp;&nbsp;&nbsp;├──&nbsp;vite.config.ts&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;Vite&nbsp;빌드/개발&nbsp;서버&nbsp;설정&nbsp;(프록시&nbsp;등)<br>
│&nbsp;&nbsp;&nbsp;├──&nbsp;eslint.config.js&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;ESLint&nbsp;설정<br>
│&nbsp;&nbsp;&nbsp;├──&nbsp;tsconfig.json&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;TypeScript&nbsp;루트&nbsp;설정<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;├──&nbsp;tsconfig.app.json&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;브라우저&nbsp;앱용&nbsp;TS&nbsp;설정&nbsp;(src/)<br>
│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;└──&nbsp;tsconfig.node.json&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;Node.js&nbsp;설정용&nbsp;TS&nbsp;설정&nbsp;(vite.config.ts)<br>
│&nbsp;&nbsp;&nbsp;├──&nbsp;package.json&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;프론트엔드&nbsp;필요&nbsp;패키지&nbsp;+&nbsp;스크립트&nbsp;정보<br>
│&nbsp;&nbsp;&nbsp;└──&nbsp;package-lock.json&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;프론트엔드&nbsp;필요&nbsp;패키지&nbsp;버전&nbsp;정보<br>
│<br>
└──&nbsp;README.md<br>


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
