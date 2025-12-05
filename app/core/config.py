import os

from enum import Enum

import torch

import yaml

# from typing import Optional
# Optional은 None 값을 허용할 수 있는 타입을 지정할 때 사용
# # Optional[T]는 T 타입이거나 None이 될 수 있다. 이는 Union[T, None]의 단축형으로, 함수 매개변수나 반환값, 변수가 "값이 없을 수도 있다"는 경우에 적합

class WeightTying(Enum):
    NOTYING = 0
    TYINGALL = 1
    TYINGSRCTGT = 2
    TYINGTGTFFC = 3
    TYINGSRCFFC = 4

def load_config(path: str = "config.yaml") -> dict:
    """YAML 파일에서 설정을 읽어 dict로 반환"""
    with open(path, "r", encoding="utf-8") as f:
        cfg = yaml.safe_load(f)  # 안전한 로더 사용[web:84][web:86]
    return cfg or {}


_cfg = load_config()  # 모듈 import 시 1번만 읽음


class Settings:
    MODEL_PATH: str = _cfg.get("MODEL_PATH", "models/ko_en_transformer.pth")

    TOKENIZER_NAME: str = _cfg.get("TOKENIZER_NAME", "KETI-AIR/ke-t5-base")
    LEN_VOCAB: int = int(_cfg.get("LEN_VOCAB", 64101))
    START_IDX: int = int(_cfg.get("START_IDX", 64100))
    END_IDX: int = int(_cfg.get("END_IDX", 1))
    PADDING_IDX: int = int(_cfg.get("PADDING_IDX", 0))
    UNK_IDX: int = int(_cfg.get("UNK_IDX", 2))
    Q_DIM: int = int(_cfg.get("Q_DIM", 512))

    # 문자열 → Enum
    WEIGHT_TYING: WeightTying = WeightTying[
        _cfg.get("WEIGHT_TYING", "NOTYING")
    ]

    # bool은 문자열 비교 대신 직접 bool로 저장
    VISUALIZATION: bool = bool(_cfg.get("VISUALIZATION", True))
    HTML_PATH: str = _cfg.get("HTML_PATH", "models")

    MAX_LENGTH: int = int(_cfg.get("MAX_LENGTH", 512))

    # DEVICE는 런타임 환경 보고 결정
    DEVICE: str = "cuda" if torch.cuda.is_available() else "cpu"

    BATCH_SIZE: int = int(_cfg.get("BATCH_SIZE", 1))


settings = Settings()


# yaml에서 불러오는 방식으로 변경
# class Settings:
#     MODEL_PATH: str = os.getenv("MODEL_PATH", "models/ko_en_transformer.pth")
    
#     # TOKENIZER_PATH: str = os.getenv("TOKENIZER_PATH", "models/tokenizer.json")
#     TOKENIZER_NAME: str = os.getenv("TOKENIZER_NAME", "KETI-AIR/ke-t5-base")
#     LEN_VOCAB: int = int(os.getenv("LEN_VOCAB", "64101"))
#     START_IDX: int = int(os.getenv("START_IDX", "64100"))
#     END_IDX: int = int(os.getenv("END_IDX", "1"))
#     PADDING_IDX: int = int(os.getenv("PADDING_IDX", "0"))
#     UNK_IDX: int = int(os.getenv("UNK_IDX", "2"))
#     Q_DIM: int = int(os.getenv("Q_DIM", "512"))
#     WEIGHT_TYING: WeightTying = WeightTying[os.getenv("WEIGHT_TYING", "NOTYING")]

#     VISUALIZATION: bool = True if os.getenv("VISUALIZATION", "True") == "True" else False

#     MAX_LENGTH: int = int(os.getenv("MAX_LENGTH", "512"))
#     # MAX_LENGTH: Optional[int] = int(os.getenv("MAX_LENGTH", "512"))
    
#     DEVICE: str = "cuda" if torch.cuda.is_available() else "cpu"
    
#     BATCH_SIZE: int = int(os.getenv("BATCH_SIZE", "1"))