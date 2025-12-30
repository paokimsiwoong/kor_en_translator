# from fastapi import FastAPI
# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
# 422(pydantic validation error) - RequestValidationError
# 처리하는 핸들러 설정에 사용
# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from app.api.v1.routes import translate, auth, users
from app.core.config import settings

# from app.db.models.user import User
# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
from app.db.models import *
# app/db/models/__init__.py에서 *에 들어갈 테이블 지정
# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
from app.db.base import Base
from app.db.session import engine

app = FastAPI(
    title="Kor-En Translator API",
    description="한국어 → 영어 Transformer 번역 서비스",
    version="1.0.0"
)
# FastAPI는 자동으로 문서 생성
# localhost:8000/docs로 문서 접근 가능
# localhost:8000/redoc

# RequestValidationError 전역 핸들러
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    
    for error in exc.errors():
        field = error['loc'][0] if error['loc'] else '입력값'
        message = error['msg']
        
        # 커스텀 메시지 매핑
        if 'email' in str(error['loc']):
            message = '올바른 이메일 주소를 입력해주세요 (예: test@gmail.com)'
        
        # @@@ UserCreate에서 Field를 이용해 길이를 제한하고
        # @@@ field_validator로 특정 검증 로직을 추가한 경우 여기서 해당 에러 메시지 설정 가능
        # elif 'password' in str(error['loc']):
        #     message = '비밀번호는 8자 이상 입력해주세요'
        # elif 'username' in str(error['loc']):
        #     message = '사용자명은 3~50자 영문/숫자만 가능합니다'
        
        errors.append({
            'field': field,
            'message': message
        })
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            'detail': errors[0]['message'] if errors else '입력 오류',  # 첫 번째 에러만
            'errors': errors  # 전체 에러 리스트 (선택)
        }
    )

# Base.metadata 등록되어 있는 모든 테이블 생성
# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# # from app.db.models import *로 Base를 상속한 테이블들이 메모리에 로드될 때 metadata에 등록된다
# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Base.metadata.create_all(bind=engine)

# CORS(Cross-Origin Resource Sharing)
# 브라우저는 보안상 다른 도메인 간 요청을 기본적으로 차단
# FastAPI CORS 미들웨어는 서버가 브라우저에게 다른 도메인에서 요청을 받아도 CORS 에러가 발생하지 않도록 설정한다
    # @@@ CORS는 브라우저의 구현 스펙에 포함되는 정책이기 때문에, 브라우저를 통하지 않고 서버 간 통신을 할 때는 이 정책이 적용되지 않는다.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # [*]은 모든 도메인의 요청을 받아들이므로 보안 취약 -> 개발, 테스트 환경에서만 사용
    # [
    #   "https://your-frontend.com",
    #   "http://localhost:3000"  # 개발 환경만
    # ] 와 같이 요청을 허용하는 도메인 지정 가능
    allow_credentials=True,
    allow_methods=["*"], # [*]은 모든 method 다 허용하므로 문제 발생 가능성 높음
    # allow_methods=["GET", "POST", "OPTIONS"], 와 같이 가능한 method 제한 가능
    allow_headers=["*"],
    # allow_headers=["Content-Type", "Authorization"], 와 같이 가능한 header 제한 가능
)

# API Router는 Mini FastAPI로 app.main.py에서 여러 API를 연결해서 활용
# 라우터 등록
app.include_router(translate.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Ko-En Translator API is running", "model_device": settings.DEVICE}
# localhost:8000에 접근하면 GET 결과를 볼 수 있음

if __name__ == "__main__":
    # uvicorn.run(app, host="0.0.0.0", port=8000)
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0", 
        port=8000, 
        reload=True
    )
    # uvicorn.run은 터미널에서 uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 명령어를 사용하는 것과 동일
