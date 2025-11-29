import os

import torch

# from typing import Optional
# Optional은 None 값을 허용할 수 있는 타입을 지정할 때 사용
# # Optional[T]는 T 타입이거나 None이 될 수 있다. 이는 Union[T, None]의 단축형으로, 함수 매개변수나 반환값, 변수가 "값이 없을 수도 있다"는 경우에 적합


class Settings:
    MODEL_PATH: str = os.getenv("MODEL_PATH", "models/ko_en_transformer.pth")
    # TOKENIZER_PATH: str = os.getenv("TOKENIZER_PATH", "models/tokenizer.json")
    TOKENIZER_NAME: str = os.getenv("TOKENIZER_NAME", "KETI-AIR/ke-t5-base")
    MAX_LENGTH: int = int(os.getenv("MAX_LENGTH", "512"))
    # MAX_LENGTH: Optional[int] = int(os.getenv("MAX_LENGTH", "512"))
    DEVICE: str = "cuda" if torch.cuda.is_available() else "cpu"
    BATCH_SIZE: int = int(os.getenv("BATCH_SIZE", "1"))

settings = Settings()
