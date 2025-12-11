# app/db/session.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# TODO:sqlite ==> postgreSQL로 변경하기
SQLALCHEMY_DATABASE_URL = "sqlite:///./app.db"
# 프로젝트 루트에 app.db 파일을 생성

# create_engine 함수는 SQLAlchemy의 DB 연결 관리자(Engine) 생성
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, # DB 연결 url
    connect_args={"check_same_thread": False}, 
    # sqlite 기본설정은 단일 스레드에서만 사용 가능
    # FastAPI는 비동기라 여러 스레드에서 동시 접근하므로 "check_same_thread": False로 여러 스레드에서 접근 가능하게 변경
)

# sessionmaker는 DB 세션(transaction)을 생성하고 관리
SessionLocal = sessionmaker(
    autocommit=False, # 기본값은 True(변경이 있으면 자동 커밋) => False로 두어 각 세션에서 명시적으로 commit() 사용해야 함
    autoflush=False, # 기본값은 True(변경 전에 자동으로 flush) => False로 두어 각 세션에서 명시적으로 flush() 사용해야 함
    bind=engine, # create_engine으로 생성한 engine 연결
)

# FastAPI에서 사용할 db 세션을 제공하는 함수
def get_db():
    db = SessionLocal() # 새로운 세션 생성
    try:
        yield db # FastAPI에 세션 전달 + 실행 정지(함수 실행 중 유지)
    finally:
        db.close() # 요청 끝나면 자동 정리
# # FastAPI에서 사용 예시
# # @app.post("/users/")
# # def create_user(user: UserCreate, db: Session = Depends(get_db)):  # 자동 세션 제공
# #     # db는 이미 열린 상태
# #     db.add(new_user)
# #     db.commit()  # 트랜잭션 커밋
# #     # 함수 끝나면 db.close() 자동 호출
