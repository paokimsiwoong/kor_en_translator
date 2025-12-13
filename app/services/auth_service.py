# app/services/auth_service.py
# 유저 등록, 검증을 담당

from datetime import timedelta
from typing import Optional

from fastapi import HTTPException, status

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
)
from app.db.models.user import User # User는 users 테이블의 파이썬 객체
from app.schemas.user import UserCreate, UserOut

from app.core.config import settings


class AuthService:
    # 유저 등록 함수
    @staticmethod
    def register_user(db: Session, user_in: UserCreate) -> UserOut:

        # 이메일/유저명 중복 체크
        # if db.query(User).filter(User.email == user_in.email).first():
        # # db.query 방식은 legacy ==> SQLAlchemy 2.0 방식으로 변경
        if db.execute(select(User).where(User.email == user_in.email)).scalar_one_or_none():
            # select(User)로 users 테이블 선택 후
            # .where로 email이 동일한 데이터를 찾는다
            # .scalar_one_or_none()는 검색 결과에서 첫번째 하나의 데이터만 반환하거나 
            # 검색 결과가 없으면 None을 반환
            # # None 이 아니여서 if 조건이 통과되면 기존에 있는 이메일 ==> raise
            raise HTTPException(status_code=400, detail="이미 등록된 이메일입니다.")
        # if db.query(User).filter(User.username == user_in.username).first():
        if db.execute(select(User).where(User.username == user_in.username)).scalar_one_or_none():
            raise HTTPException(status_code=400, detail="이미 사용 중인 닉네임입니다.")

        # 중복되지 않은 이메일, 닉네임이면 생성으로 넘어가기

        # db에는 해쉬된 패스워드를 저장해야 하므로 패스워드 해쉬
        hashed_pw = get_password_hash(user_in.password)

        # users 테이블에 입력할 수 있도록 데이터 입력
        user = User(
            email=user_in.email,
            username=user_in.username,
            hashed_password=hashed_pw,
        )

        # db에 등록
        db.add(user)
        db.commit()

        # db에 저장된 최신 정보를 user에 갱신
        db.refresh(user)
        # @@@ pydantic 클래스 UserOut에는 id 필드가 필수인 상태에서
        # @@@ user(User)에는 아직 id 필드가 채워지지 않은 상태
        # @@@ @@@ db에 들어가면서 primary key인 id가 결정된다
        # @@@ db.refresh(user)를 하면 
        # @@@ db에 저장된 id를 불러와 user에 저장한다
        # @@@ @@@ sessionmaker 생성 시에 expire_on_commit=False로 설정하면 
        # @@@ @@@ commit 후에 속성(여기서는 user) 접근 시 자동으로 DB에서 로드하므로
        # @@@ @@@ refresh를 안해도 된다

        # return UserOut.from_orm(user) 
        # # from_orm - deprecated
        return UserOut.model_validate(user)

    # 유저 검증 함수
    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
        # user = db.query(User).filter(User.email == email).first()
        # 해당 이메일을 가지는 user 있는지 db에서 확인
        user = db.execute(select(User).where(User.email == email)).scalar_one_or_none()

        if not user:
            # 해당 유저가 없으면 None 반환
            return None
        if not verify_password(password, user.hashed_password):
            # 비밀번호가 틀리면 None 반환
            return None
        return user

    # 토큰 생성 함수 (위의 유저 검증 함수를 통과한 경우에 실행된다)
    @staticmethod
    def create_user_token(user: User) -> str:
        # 토큰 유효기간 설정
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        # 토큰 생성후 반환
        return create_access_token(
            data={"sub": str(user.id)},
            expires_delta=access_token_expires,
        )
