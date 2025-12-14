# app/api/v1/routes/auth.py
# /auth 엔드포인트 관리

# from typing import Annotated
# typing의 Annotated는 Annotated[타입, 메타데이터] 형태로 쓰여서
# 타입 + 추가 정보를 타입 힌트에 포함시킨다
# # Annotated를 사용하면 IDE가 타입과 추가 정보(의존성 등)을 모두 인식
# # # app.core.deps에서 의존성 타입 별칭 불러오는 방식 => 여기선 Annotated 필요 없음

# from fastapi import APIRouter, Depends, HTTPException, status
from fastapi import APIRouter, HTTPException, status
# from fastapi.security import OAuth2PasswordRequestForm
# from sqlalchemy.orm import Session

# from app.db.session import get_db
from app.schemas.user import UserCreate, UserOut, Token
from app.services.auth_service import AuthService

from app.core.deps import LoginForm, DBDep

# /auth endpoint router 생성
router = APIRouter(prefix="/auth", tags=["auth"])

# /register == 유저 생성
@router.post("/register", response_model=UserOut)
def register(user_in: UserCreate, db: DBDep):
    return AuthService.register_user(db, user_in)
# def register(user_in: UserCreate, db: Session = Depends(get_db)): 
# # 자주 쓰이는 db: Session = Depends(get_db) 패턴을 app.core.deps안에 DBDep로 정리

# /login == 검증 후 문제 없으면 토큰 반환
@router.post("/login", response_model=Token)
def login(
    # form_data: OAuth2PasswordRequestForm = Depends(),
    # db: Session = Depends(get_db),
    form_data: LoginForm,
    db: DBDep,
):
    user = AuthService.authenticate_user(db, email=form_data.username, password=form_data.password)
    # form_data.username은 이메일 =/= users 테이블의 username 
    if not user:
        # authenticate_user함수는 해당 유저가 없거나 비밀번호가 틀리면 None 반환
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 올바르지 않습니다.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 유저 검증이 정상적으로 통과되면 토큰 생성 후 반환
    token = AuthService.create_user_token(user)
    return Token(access_token=token)