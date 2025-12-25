## 한국어 문장을 담은 요청에 영어로 번역한 답변을 내놓는 간단한 http 서버

backend/
├── app/
│   ├── \_\_init__.py
│   ├── main.py              # FastAPI 엔트리포인트
│   ├── api/
│   │   ├── \_\_init__.py
│   │   └── v1/
│   │       ├── \_\_init__.py
│   │       └── routes/
│   │           ├── \_\_init__.py
│   │           ├── auth.py        # /auth 라우터
│   │           ├── users.py       # /users 라우터
│   │           └── translate.py   # /translate 라우터
│   ├── core/
│   │   ├── \_\_init__.py
│   │   ├── deps.py          # 의존성 정의 및 현재 유저 정보 반환 함수
│   │   ├── security.py      # 비밀번호 해시 생성/검증과 JWT 생성/검증
│   │   └── config.py        # 설정 (경로, device 등)
│   ├── db/
│   │   ├── \_\_init__.py
│   │   ├── base.py              # 테이블 파이썬 클래스들이 상속할 Base 클래스 정의
│   │   ├── session.py           # SQL 종류 지정 및 db 세션 생성 함수 정의
│   │   └── models/
│   │       ├── \_\_init__.py
│   │       └── user.py          # DB안의 users 테이블 데이터에 대응하는 파이썬 클래스 정의
│   ├── ml/
│   │   ├── \_\_init__.py
│   │   ├── blocks.py        # 모델 layer 정의
│   │   ├── embeddings.py    # 토큰 임베딩 정의
│   │   ├── pe.py            # Positional embedding 정의
│   │   ├── transformer.py   # Transforemr 모델 정의
│   │   ├── visualize.py     # 추론 과정 attention score 시각화
│   │   └── translator.py    # Transformer 로딩 & 추론 래퍼
│   ├── schemas/
│   │   ├── \_\_init__.py
│   │   ├── user.py          # 유저 관련 Pydantic 모델 (요청/응답)
│   │   └── translation.py   # 번역 관련 Pydantic 모델 (요청/응답)
│   └── services/
│       ├── \_\_init__.py
│       ├── auth_service.py        # 유저 등록, 검증 로직
│       └── translation_service.py # 번역 로직 (전처리/후처리)
├── models/
│   └── ko_en_transformer.pt # 학습된 PyTorch 모델 가중치
├── tests/
│   ├── \_\_init__.py
│   └── test_translate.py    # 간단한 API/서빙 테스트
├── config.yaml    # 설정 파일
└── README.md

## TODO
- [X] 유저 등록 및 로그인 - 보안
- [ ] viz True 일 경우 attention score 결과 html 보내기