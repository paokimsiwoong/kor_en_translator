# app/api/v1/routes/translate.py
# /translate 엔드포인트 관리

from fastapi import APIRouter, HTTPException, Depends

from sqlalchemy.orm import Session

# from ....schemas.translation import TranslationRequest, TranslationResponse, BatchTranslationRequest, BatchTranslationResponse, HealthResponse
# @@@ 모듈 방식 실행을 할 경우 .... 상대경로 import 대신 app.으로 변경해도 문제없음
from app.schemas.translation import TranslationRequest, TranslationResponse, BatchTranslationRequest, BatchTranslationResponse, HealthResponse
from app.services.translation_service import TranslationService
from app.core.deps import CurrentUser, DBDep
# from app.db.session import get_db
# from app.db.models.user import User

# API Router는 Mini FastAPI로 app.main.py에서 여러 API를 연결해서 활용
# /translate 아래의 모든 엔드포인트를 이 파일에 모아 관리
router = APIRouter(prefix="/translate", tags=["translation"])

# decorator의 response_model 인자에 원하는 response body의 형태를 pydantic BaseModel을 상속하는 클래스로 지정하면
# 함수 반환값을 지정한 클래스 정의에 맞게 변환해주고 동시에 데이터 유효성 검사까지 다 진행해준다.
@router.post("/", response_model=TranslationResponse) # 이 라우터의 기본 경로는 단일 문장 번역
async def translate_text(
    request: TranslationRequest,
    current_user: CurrentUser, # 토큰 필수
    # db: DBDep,
):
    """한국어를 영어로 번역합니다"""
    try:
        return TranslationService.translate_ko_to_en(request, current_user.username)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
        # FastAPI의 HTTPException은 Error Response를 더 쉽게 보낼 수 있도록 하는 Class로
        # 사용하면 자동으로 JSON 응답 + 적절한 HTTP 상태코드 반환
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")
    
# @router.post("/old", response_model=TranslationResponse) # 이 라우터의 기본 경로는 단일 문장 번역
# async def old_translate_text(request: TranslationRequest):
#     """한국어를 영어로 번역합니다"""
#     try:
#         return TranslationService.translate_ko_to_en(request)
#     except ValueError as e:
#         raise HTTPException(status_code=400, detail=str(e))
#         # FastAPI의 HTTPException은 Error Response를 더 쉽게 보낼 수 있도록 하는 Class로
#         # 사용하면 자동으로 JSON 응답 + 적절한 HTTP 상태코드 반환
#     except Exception:
#         raise HTTPException(status_code=500, detail="Internal server error")
    
@router.post("/batch", response_model=BatchTranslationResponse) # /batch는 복수 문장 번역
async def batch_translate_text(
    request: BatchTranslationRequest,
    current_user: CurrentUser, # 토큰 필수
    # db: DBDep,
):
    """한국어 문장들을 영어로 번역합니다"""
    try:
        return TranslationService.batch_translate_ko_to_en(request)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
        # FastAPI의 HTTPException은 Error Response를 더 쉽게 보낼 수 있도록 하는 Class로
        # 사용하면 자동으로 JSON 응답 + 적절한 HTTP 상태코드 반환
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")
    
# @router.post("/old/batch", response_model=BatchTranslationResponse) # /batch는 복수 문장 번역
# async def batch_translate_text(request: BatchTranslationRequest):
#     """한국어 문장들을 영어로 번역합니다"""
#     try:
#         return TranslationService.batch_translate_ko_to_en(request)
#     except ValueError as e:
#         raise HTTPException(status_code=400, detail=str(e))
#         # FastAPI의 HTTPException은 Error Response를 더 쉽게 보낼 수 있도록 하는 Class로
#         # 사용하면 자동으로 JSON 응답 + 적절한 HTTP 상태코드 반환
#     except Exception:
#         raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(model_loaded=True)
