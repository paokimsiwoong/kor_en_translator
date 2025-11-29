# Kor_En_translator
---
## 한국어 문장을 담은 요청에 영어로 번역한 답변을 내놓는 간단한 http 서버


ko-en-translator/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI 엔트리포인트
│   ├── api/
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       └── routes/
│   │           ├── __init__.py
│   │           └── translate.py   # /translate 라우터
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py        # 설정 (경로, device 등)
│   ├── models/
│   │   ├── __init__.py
│   │   └── translator.py    # Transformer 로딩 & 추론 래퍼
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── translation.py   # Pydantic 모델 (요청/응답)
│   └── services/
│       ├── __init__.py
│       └── translation_service.py # 비즈니스 로직 (전처리/후처리)
├── models/
│   └── ko_en_transformer.pt # 학습된 PyTorch 모델 가중치
├── scripts/
│   └── export_model.py      # 학습된 모델 export용 (선택)
├── tests/
│   ├── __init__.py
│   └── test_translate.py    # 간단한 API/서빙 테스트
├── requirements.txt
├── Dockerfile               # 선택: 배포용
└── README.md

