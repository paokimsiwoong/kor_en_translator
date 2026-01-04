# app/api/v1/routes/viz.py
# /viz 엔드포인트 관리

import os

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.schemas.translation import VizResponse
from app.core.config import settings
from app.core.deps import CurrentUser



router = APIRouter(prefix="/viz", tags=["viz"])


# 직접 파일 서빙
@router.get("/{folder}/{filename}", response_model=VizResponse)
async def get_viz_html(
    folder: str, 
    filename: str,
    current_user: CurrentUser,
):
    file_path = os.path.join(settings.HTML_PATH_ABS, folder, filename)

    # 경로에 파일이 없으면 raise
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    # html 파일 내용을 읽어와 str에 저장
    with open(file_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    return VizResponse(html=html_content)