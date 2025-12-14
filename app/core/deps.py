# app/core/deps.py
# 의존성(의존 가능) 타입(dependency 또는 dependable)들의 타입 별칭들을 정의하고 
# JWT 검증 후 유저 정보를 반환하는 함수를 정의
# # path operation function(경로 작동 함수)가 작동하는데 필요한 것들을 의존성(dependency 또는 dependable)이라 한다

from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.session import get_db
from app.db.models.user import User

from jose import JWTError

# 여러 엔드포인트에서 반복되는 의존성 타입들을 Annotated를 이용해 타입 별칭 정의해서 재사용 가능하게 하기

# OAuth2PasswordBearer는 
# 요청의 Authorization 헤더에서 Bearer <access_token> 형식의 토큰 문자열을 꺼내서, 
# 의존성으로 주입해 주는 토큰 추출기(스키마)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
# 실제 요청 처리 시에는 Authorization: Bearer <access_token> 헤더에서 
# <access_token> 부분만 뽑아서 문자열로 반환
# tokenUrl: 
# # 어디로 로그인 요청을 보내야 토큰을 발급받을 수 있는 지 tokenUrl에 정보를 저장
# # (현재 /api/v1/auth/login 엔드포인트에서 토큰을 발급)
# # # ==> tokenUrl은 실제로 OAuth2PasswordBearer가 요청을 보내는 것이 아니라, 
# # # ==> API 문서(OpenAPI/Swagger)에 “이 스키마용 토큰 발급 엔드포인트는 여기다” 라고 표시하는 데 사용

LoginForm = Annotated[OAuth2PasswordRequestForm, Depends()]
# # OAuth2PasswordRequestForm 를 사용하면 Content-Type 헤더에 JSON 대신
# # 반드시 form data 형태(application/x-www-form-urlencoded 헤더)를 사용해야 하고
# # username, password 필드가 강제된다 (OAuth2 표준)
# # # FastAPI의 Swagger UI와 호환되어 /docs에서 form data 입력 및 인증 테스트 가능

# 토큰 정보를 추출하는 dependency
Token = Annotated[str, Depends(oauth2_scheme)]
# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# FastAPI는 Depends(oauth2_scheme)를 보고, 
# 이 인자를 사용자 코드가 아니라 의존성 시스템이 채워야 할 값으로 인식
# # ==> 새 요청이 들어오면 FastAPI가 알아서 dependency(여기서는 oauth2_scheme)에 정확한 파라메터들을 입력하고
# # ==> dependency의 결과를 받아 dependency를 인자로 사용하는 함수의 파라메터에 적절하게 입력한다
# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

# 반복 사용되는 db: Session = Depends(get_db)
DBDep = Annotated[Session, Depends(get_db)]


# JWT를 검증하고 검증 성공 시 User 정보를 반환하는 함수
def get_current_user(
    # token: str = Depends(oauth2_scheme),
    token: Token,
    # get_current_user 안에서 token은 FastAPI가 알아서 dependency를 실행 후 결과를 입력
    # ==> 이미 Authorization 헤더에서 추출한 순수 토큰 문자열로 들어온 상태
    db: DBDep,
) -> User:
    
    # 토큰 검증이 실패할 경우의 HTTPException 정의
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="인증 정보가 올바르지 않습니다.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # JWT 검증
        payload = decode_access_token(token)

        # 토큰 안에서 user id 정보 가져오기
        user_id: str | None = payload.get("sub")

        # 저장된 user id가 없는 경우 예외 처리
        if user_id is None:
            raise credentials_exception
    except JWTError:
        # 토큰 검증에 실패한 경우 예외 처리
        raise credentials_exception
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")
    
    # user = db.query(User).filter(User.id == int(user_id)).first()
    # 토큰에서 얻어진 user id로 db에서 해당 id 검색
    user = db.execute(select(User).where(User.id == int(user_id))).scalar_one_or_none()

    # db에서 해당 id를 가진 user가 없을 경우 예외 처리
    if user is None:
        raise credentials_exception
    
    # user 정보 반환
    return user

# 여러 엔드포인트에서 반복되는 의존성 타입들의 타입 별칭 정의해서 재사용 가능하게 하기
CurrentUser = Annotated[User, Depends(get_current_user)]