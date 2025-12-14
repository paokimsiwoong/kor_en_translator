# app/api/v1/routes/users.py
# /users 엔드포인트 관리


# from fastapi import APIRouter, Depends
from fastapi import APIRouter
# from sqlalchemy.orm import Session

# from app.core.deps import get_current_user
# from app.db.session import get_db
# from app.core.deps import DBDep, CurrentUser
from app.core.deps import CurrentUser
from app.schemas.user import UserOut
# from app.db.models.user import User

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserOut)
def read_users_me(
    # current_user: User = Depends(get_current_user),
    # db: Session = Depends(get_db),
    current_user: CurrentUser,
    # db: DBDep, # 현재 여기서는 db가 필요 없음
):
    # current_user는 이미 인증된 User 모델 인스턴스
    return current_user
# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# @@@ GET /users/me 요청 흐름 @@@
# 헤더로 Authorization: Bearer <JWT-토큰>를 담은 
# GET /users/me 요청이 들어오면
# FastAPI가 read_users_me의 의존성 그래프를 분석
# current_user: CurrentUser = Annotated[User, Depends(get_current_user)]를 보고
# get_current_user를 먼저 호출해야 하는 것을 파악하고
# # get_current_user는 token: Token = Annotated[str, Depends(oauth2_scheme)] 과 db: DBDep = Annotated[Session, Depends(get_db)] 이 인자로 있으므로
# # oauth2_scheme, get_db 의존성들을 먼저 호출해야 하는 것을 파악한다
# # # oauth2_scheme은 호출하면 요청 헤더에서 Authorization 헤더를 읽고 
# # # 형식이 Bearer <JWT-토큰>이면 <JWT-토큰>만 잘라서 반환하고 없거나 형식이 다르면 HTTPException(401)을 발생시킨다
# # # get_db는 호출하면 새로운 세션을 생성해 get_current_user에 세션을 yield한 뒤 대기
# # get_current_user의 내부 코드가 이제 실행되면서 oauth2_scheme 의존성이 제공한 token 값으로 JWT를 검증하고
# # get_db 의존성이 제공한 세션을 통해 DB에서 user를 조회한다
# # 이 과정에서 실패하면 credentials_exception 발생, 성공하면 User 객체를 반환한다
# read_users_me는 이제 get_current_user 의존성이 반환한 User 객체를 그대로 다시 반환한다
# # 만약 get_current_user에 exit code(code after yield)가 있으면 read_users_me 반환 후 실행 (현재는 없음) -> get_current_user 종료(closed)
# /users/me 응답을 클라이언트에 전송
# # # get_db의 exit code(yield db 뒤 finally: db.close())가 실행되고 get_db 종료(closed)
# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@