# app/db/models/user.py
# from sqlalchemy import Column, Integer, String
# from app.db.base import Base

# class User(Base):
#     __tablename__ = "users"

#     id = Column(Integer, primary_key=True, index=True)
#     email = Column(String, unique=True, index=True, nullable=False)
#     username = Column(String, unique=True, index=True, nullable=False)
#     hashed_password = Column(String, nullable=False)


# app/db/models/user.py (2.0 Mapped 버전)
# DB안의 users 테이블에 대응하는 파이썬 클래스 정의

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
# @@@ Mapped, mapped_column를 사용하면
# @@@ pydantic BaseModel과 호환도 좋고(자동 변환 보장)
# @@@ 타입 체크, IDE 자동완성 지원 등 이점
# @@@ @@@ 단 Base가 1.x 방식의 함수반환값이 아닌 2.0 방식의 제대로 정의된 클래스여야 사용 가능

from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    username: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)