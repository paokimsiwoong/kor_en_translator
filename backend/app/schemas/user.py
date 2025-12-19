# app/schemas/user.py
# 유저 생성, 인증 관련 요청/응답 schema 정의 

from pydantic import BaseModel, EmailStr, ConfigDict
# EmailStr은 이메일 형식 유효성 검증을 자동으로 해주는 pydantic 타입

# 유저 생성 요청
class UserCreate(BaseModel):
    email: EmailStr
    # RFC 5322 이메일 형식을 검사하고, 유효하지 않으면 검증 에러를 발생
    password: str
    username: str

# 유저 생성 응답
class UserOut(BaseModel):
    id: int
    email: EmailStr
    username: str

    model_config = ConfigDict(from_attributes=True)  # orm_mode=True 대체
    # auth_service의 register_user 함수 return UserOut.from_orm(user) 부분
    # .from_orm이 deprecated 되서 최신 버전으로 바꾸려면 이 코드 필요

# 로그인 성공 시 JWT 발급 응답
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
