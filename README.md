# Kor_En_translator
---
## 한국어 문장을 담은 요청에 영어로 번역한 답변을 내놓는 간단한 http 서버


ko-en-translator/
├── app/
│   ├── \_\_init__.py
│   ├── main.py              # FastAPI 엔트리포인트
│   ├── api/
│   │   ├── \_\_init__.py
│   │   └── v1/
│   │       ├── \_\_init__.py
│   │       └── routes/
│   │           ├── \_\_init__.py
│   │           └── translate.py   # /translate 라우터
│   ├── core/
│   │   ├── \_\_init__.py
│   │   └── config.py        # 설정 (경로, device 등)
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
│   │   └── translation.py   # Pydantic 모델 (요청/응답)
│   └── services/
│       ├── \_\_init__.py
│       └── translation_service.py # 비즈니스 로직 (전처리/후처리)
├── models/
│   └── ko_en_transformer.pt # 학습된 PyTorch 모델 가중치
├── scripts/
│   └── export_model.py      # 학습된 모델 export용 (선택)
├── tests/
│   ├── \_\_init__.py
│   └── test_translate.py    # 간단한 API/서빙 테스트
├── requirements.txt
├── Dockerfile               # 선택: 배포용
└── README.md

## TODO
- [ ] 유저 등록 및 로그인 - 보안
- [ ] viz True 일 경우 attention score 결과 html 보내기
- [ ] front 만들기
