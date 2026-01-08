# app/services/translation_service.py
# 한영 번역을 실행하고 결과 및 예외 처리

# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
# app/api/v1/routes/translate.py 안에서 번역 로직을 함께 포함하지 않고 분리
    # app/api/v1/routes/translate.py      → HTTP 요청/응답만 담당
        # HTTP 상태코드 처리 (400, 500 등), Pydantic 검증 에러 처리, ...
    # app/services/translation_service.py → 실제 번역 로직만 담당
        # 모델 추론, 비즈니스 규칙 (길이 제한, 캐싱 등), ...
    # 분리하면 translate router가 아닌 다른 곳에서도 번역 사용 가능
    # 테스트를 분리해서 할 수 있어 좋음
# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


from app.ml.translator import translator
from app.schemas.translation import TranslationRequest, TranslationResponse, BatchTranslationRequest, BatchTranslationResponse
from typing import Optional

class TranslationService:
    # 단일 문장 번역  
    @staticmethod
    def translate_ko_to_en(request: TranslationRequest, user_name="test") -> TranslationResponse:
        try:
            if not request.text.strip():
                raise ValueError("Text cannot be empty")
            
            result = translator.translate([request.text], request.max_length, viz=request.viz, user_name=user_name)

            if request.viz:
                return TranslationResponse(original=request.text, translation=result[0] if len(result) != 0 else "", viz_url=f"/api/v1/viz/{user_name}")

            return TranslationResponse(original=request.text, translation=result[0] if len(result) != 0 else "")
        except Exception as e:
            raise ValueError(f"Translation failed: {str(e)}")

    # 복수 문장 번역 
    @staticmethod
    def batch_translate_ko_to_en(request: BatchTranslationRequest, user_name="test") -> BatchTranslationResponse:
        try:
            # if not request.texts.strip():
            #     raise ValueError("Text cannot be empty")
            
            results = translator.translate(request.texts, request.max_length, viz=request.viz, user_name=user_name)

            if request.viz:
                return BatchTranslationResponse(original=request.texts, translation=results, viz_url=f"/api/v1/viz/{user_name}")

            return BatchTranslationResponse(original=request.texts, translation=results)
        except Exception as e:
            raise ValueError(f"Translation failed: {str(e)}")
