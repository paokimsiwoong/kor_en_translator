# app/db/session.py
# SQL 종류 지정 및 db 세션 생성 함수 정의

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

# sessionmaker는 DB 세션(transaction)을 생성하는 클래스
SessionLocal = sessionmaker(
    autocommit=False, # 기본값은 True(변경이 있으면 자동 커밋) => False로 두어 각 세션에서 명시적으로 commit() 사용해야 함
    autoflush=False, # 기본값은 True(변경 전에 자동으로 flush) => False로 두어 각 세션에서 명시적으로 flush() 사용해야 함
    bind=engine, # create_engine으로 생성한 engine 연결
)
# 이 SessionLocal 자체는 세션이 아니고 호출될때마다 세션을 생성하는 세션 생성기
# # sessionmaker 클래스 주석
# # The :class:`.sessionmaker` factory generates new
# # :class:`.Session` objects when called, creating them given
# # the configurational arguments established here.

# FastAPI에서 사용할 db 세션을 제공하는 함수
# https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/?h=yield
def get_db():
    db = SessionLocal() # 새로운 세션 생성
    try:
        yield db # FastAPI에 세션 전달 + 실행 정지(함수 실행 중 유지)
    # yield 다음의 코드들은 response 생성 후(또는 get_db가 dependecy인 path operation이 종료 된 후) 
    # FastAPI가 generator를 소모(또는 close)해서 실행이 된다
    finally:
        db.close() # 요청 끝나면 자동 정리

# TODO: If you raise any exception in the code from the path operation function, it will be passed to the dependencies with yield, including HTTPException. In most cases you will want to re-raise that same exception or a new one from the dependency with yield to make sure it's properly handled.
# TODO: dependency try블록에서 except 안쓰면 신경 쓸 필요 없다? 
# This is a somewhat advanced technique, and in most of the cases you won't really need it, as you can raise exceptions (including HTTPException) from inside of the rest of your application code, for example, in the path operation function.
# If you catch an exception using except in a dependency with yield and you don't raise it again (or raise a new exception), FastAPI won't be able to notice there was an exception, the same way that would happen with regular Python:
# If you catch an exception in a dependency with yield, unless you are raising another HTTPException or similar, you should re-raise the original exception.

# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# FastAPI에서 사용 예시
# # @app.post("/users/")
# # def create_user(user: UserCreate, db: Session = Depends(get_db)):  # 자동 세션 제공 
# #     # 함수 인자로 입력할 때, get_db()로 함수 호출을 직접하지 않는다
# #     # Depends로 함수가 전달이 되면 실제 호출은 FastAPI가 요청이 들어올때마다 알아서 호출
# #     
# #     # db는 이미 열린 상태
# #     db.add(new_user)
# #     db.commit()  # 트랜잭션 커밋
# #     # 함수 끝나면 db.close() 자동 호출
# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# get_db 함수 안에서 생성된 db는 실제 데이터베이스와 상호작용(transaction)하는 Session 클래스 인스턴스
# # Session 객체 하나 == db transaction 하나
# # 이 db 객체를 이용해 db.query(), db.add, db.commit 등을 사용
# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# sql에서 하나의 transaction은 여러개의 쿼리와 
# commit(쿼리들 전부 성공 시) 또는 rollback(쿼리들 중 하나라도 실패 시)을 묶는 단위로
# 여러 쿼리들 전체가 하나의 단위로 묶여 일부만 성공하는 경우를 차단해서 데이터 무결성을 유지
# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# ex: 
# # -- 트랜잭션 없는 경우
# # UPDATE accounts SET balance = balance - 1000 WHERE user_id = 'A';  -- A 계좌 차감 성공
# # UPDATE accounts SET balance = balance + 1000 WHERE user_id = 'B';  -- B 계좌 입금 실패
# # 
# # -- A는 돈 빠졌는데 B는 못 받음 → 데이터 불일치

# # -- 트랜잭션 사용 (성공)
# # BEGIN TRANSACTION;
# # UPDATE accounts SET balance = balance - 1000 WHERE user_id = 'A';
# # UPDATE accounts SET balance = balance + 1000 WHERE user_id = 'B';
# # COMMIT;  -- 모두 성공 → 영구 저장

# # -- 트랜잭션 사용 (실패)
# # BEGIN TRANSACTION;
# # UPDATE accounts SET balance = balance - 1000 WHERE user_id = 'A';
# # -- UPDATE accounts SET balance = balance + 1000 WHERE user_id = 'B';
# # -- 입금 실패
# # ROLLBACK;  -- A 계좌도 원상 복구 → 데이터 불일치 문제 없음
# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# SQLAlchemy Session(transaction)은
# db.add, db.query등의 쿼리들 여러줄과
# db.commit() 또는 db.rollback()이 묶인 것 (+ db.close())
# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@