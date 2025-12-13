# app/core/security.py
from datetime import datetime, timedelta, timezone
from typing import Optional

# JWT(JSON Web Token) 구현 라이브러리
from jose import JWTError, jwt  # python-jose[cryptography] 라이브러리 설치
# # jwt는 jwt.encode, jwt.decode로 토큰 생성 및 검증에 사용
# # JWTError는 토큰 검증 실패 시 raise되는 exception 타입 

# 비밀번호 해싱 라이브러리
from passlib.context import CryptContext  # passlib[bcrypt] 라이브러리 설치

from app.core.config import settings

# hash 생성 및 검증을 진행할 객체 설정 및 생성
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# 로그인 시도에서 제공된 비밀번호가 db에 저장된 패스워드 해쉬의 원본인지 확인하는 함수
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password) # CryptContext.verify로 해쉬 검증


# db에 저장할 패스워드 해쉬 생성 함수
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password) # CryptContext.hash 해쉬 생성


# jwt 생성 함수
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    # data={"sub": str(user.id)} 형태
    to_encode = data.copy()

    # 토큰 만료시점 설정
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    # 토큰 만료시점 dict에 추가
    to_encode.update({"exp": expire}) # dict.update()는 다른 딕셔너리나 키-값 쌍 iterable의 내용을 현재 딕셔너리에 병합하는 메서드

    # JWT 스트링 생성
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

# jwt 검증 함수
def decode_access_token(token: str) -> dict:
    """유효한 토큰이면 payload dict를, 아니면 예외 처리"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError: # jwt.decode()는 유효하지 않은 토큰에서 JWTError를 발생
        raise 

