# app/schemas/translation.py
# 번역 관련 요청/응답 schema 정의 

from pydantic import BaseModel, Field
# Pydantic은 데이터 모델 + 자동 검증/변환을 해주는 라이브러리
# FastAPI에서 요청/응답 스키마, 설정 관리에 사용
# @@@ FastAPI는 pydantic 모델을 보고 요청/응답 schema, OpenAPI/Swagger 문서까지 자동으로 생성해준다.
from typing import Optional, List, Tuple
# Optional은 None 값을 허용할 수 있는 타입을 지정할 때 사용
# # Optional[T]는 T 타입이거나 None이 될 수 있다. 이는 Union[T, None]의 단축형으로, 함수 매개변수나 반환값, 변수가 "값이 없을 수도 있다"는 경우에 적합
# # def greet(name: Optional[str] = None) -> str:
# #     if name is None:
# #         return "Hello, stranger!"
# #     return f"Hello, {name}!"
# # 여기서 name은 str이거나 None일 수 있다
# # # python 3.10 이상에서는 Optional[str] 대신 str | None 도 사용 가능

# 단일 문장 번역 요청
class TranslationRequest(BaseModel):
    # BaseModel을 상속하면 들어온 데이터를 : type으로 지정된 type에 맞게 자동으로 변환을 시도하고
    # 지정한 타입, 구조를 만족하는지 자동으로 검증까지 진행한다
        # 검증 후 문제가 있으면 422 에러와 함께 어떤 필드가 잘못됐는지 상세한 에러 메시지를 만들어 준다

    # 번역할 원문은 text에 입력
    text: str = Field(..., min_length=1, max_length=512)
    # 지정한 길이 범위를 벗어나면 422 에러

    # 추론 결과 문장의 최대 길이 설정
    # max_length: Optional[int] = 512
    # max_length: int | None = 128  # Optional[int]과 동일
    max_length: int = Field(512, ge=128, le=1024)
    # @@@ Optional 제거
    # @@@ @@@ Optional[int]은 null 또는 int로 값을 가지는 해당 필드 자체는 존재해야 하지만
    # @@@ @@@ frontend의 max_length?: number;는 undefined일 때 필드 자체가 생략되어 pydantic 검증 실패
    # @@@ backend, frontend 모두 해당 필드와 값이 반드시 존재하도록 변경
    # @@@ @@@ 단 frontend는 interfac 정의는 그대로 두고 실제 요청 시 기본값 설정하도록 함

    # attention score 시각화 여부
    # viz: Optional[bool] = False
    viz: bool = Field(False)

# 단일 문장 번역 응답
class TranslationResponse(BaseModel):
    original: str
    translation: str
    status: str = "success"
    viz_url: str = None

# 복수 문장 번역 요청
class BatchTranslationRequest(BaseModel):
    # text: str = Field(..., min_length=1, max_length=500)
    texts: List[str] = Field(..., min_length=1)
    max_length: int = Field(512, ge=128, le=1024) # int 또는 None
    # max_length: int | None = 128  # Optional[int]과 동일

    viz: bool = Field(False)

# 복수 문장 번역 응답
class BatchTranslationResponse(BaseModel):
    original: List[str]
    translation: List[str]
    status: str = "success"
    viz_url: str = None

class HealthResponse(BaseModel):
    status: str = "healthy"
    model_loaded: bool
