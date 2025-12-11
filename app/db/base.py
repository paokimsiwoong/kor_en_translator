# app/db/base.py
# from sqlalchemy.orm import declarative_base

# Base = declarative_base() # 메타데이터 수집기 생성
# SQLAlchemy는 Base를 상속받은 모든 클래스를 자동으로 스캔해서 테이블 정보를 수집한다
# # from app.db.base import Base로 이 Base 메타데이터 수집기 import 이전에
# # from app.db.models.user import User 와 같이 Base를 상속 받은 클래스가 import로 메모리에 미리 로드되어 있으면
# # Base.metadata가 자동으로 수집 ===> Base.metadata.create_all(bind=engine) 코드 실행 시 users 테이블 생성

# @@@ 2.0 방식으로 변경
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

# @@@ declarative_base 함수의 반환값인 Base 클래스를 User 클래스가 상속하는 대신
# @@@ Base 클래스를 제대로 정의하고 User 클래스가 상속하게 하면 
# @@@ declarative_base()는 함수라서 IDE/mypy가 타입을 잘 못 읽는 문제가 해결된다