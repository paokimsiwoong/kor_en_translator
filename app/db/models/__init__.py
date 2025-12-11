# app/db/models/__init__.py

from .user import User

# from app.db.models import *로 불러올 때 *에 포함될 테이블 지정
__all__ = ["User"]