# app/models/translator.py
# 번역에 사용되는 모델을 초기화하고 추론을 진행하는 코드 

import torch

from transformers import AutoTokenizer

from typing import List, Tuple
# typing.List와 Tuple은 함수 매개변수/반환값이 리스트나 튜플일 때 내부 요소의 타입까지 명시할 수 있도록 해준다

from app.ml.transformer import Transformer
from app.ml.visualize import visualize
from app.core.config import settings


class TranslatorService:
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.device = settings.DEVICE
        self._load_model()
    
    def _load_model(self):
        """애플리케이션 시작 시 1회 모델 로드"""
        try:
            self.model = Transformer(
                src_len_vocab=settings.LEN_VOCAB,
                tgt_len_vocab=settings.LEN_VOCAB,
                start_idx=settings.START_IDX,
                end_idx=settings.END_IDX,
                padding_idx=settings.PADDING_IDX,
                unk_idx=settings.UNK_IDX,
                q_dim=settings.Q_DIM,
                k_dim=settings.Q_DIM,
                v_dim=settings.Q_DIM,
                h_dim=(settings.Q_DIM * 4),
                visualization=settings.VISUALIZATION,
                weight_tying=settings.WEIGHT_TYING,
            )
            load_dict = None
            load_dict = torch.load(
                settings.MODEL_PATH, map_location="cpu"
            )
            self.model.load_state_dict(load_dict["model_state_dict"])

            self.model.to(self.device)
            self.model.eval()
            
            # tokenizer 로드
            self.tokenizer = AutoTokenizer.from_pretrained(settings.TOKENIZER_NAME)
            special_tokens_dict = {'bos_token': '<s>'}
            self.tokenizer.add_special_tokens(special_tokens_dict)
            
            print(f"Model loaded on {self.device}")
        except Exception as e:
            print(f"Model loading failed: {e}")
            raise

    @torch.no_grad()
    def translate(self, texts: List[str], inference_max_length:int, viz: bool, user_name: str) -> List[str]:
        """greedy decoding"""

        # 전처리
        encoded = self.tokenizer(
            texts,
            return_tensors="pt",
            padding=True, # 복수 문장 중 가장 길게 encoding되는 문장 기준으로 나머지 패딩
            truncation=True,
            max_length=512,
        )

        x = encoded['input_ids'].to(self.device)
        # (batch_size, src_seq_len)
        x_mask = encoded['attention_mask'].to(self.device)
        # (batch_size, src_seq_len)
        

        # 모델 추론
        preds = self.model.inference(x, x_mask, inference_max_length, viz)
        # (batch_size, pred_seq_len)
        # @@@ 최대 추론 길이 단순히 settings.MAX_LENGTH를 대신 사용?

        if viz:
            # visualize(settings.HTML_PATH, folder_name=user_name, model=self.model, tokenizer=self.tokenizer, inputs=x, preds=preds, n_examples=4)
            visualize(settings.HTML_PATH, folder_name=user_name, model=self.model, tokenizer=self.tokenizer, inputs=x, preds=preds, n_examples=x.size(0))
            # @@@ 임시로 전체 문장 시각화
        

        # 후처리
        decoded_preds = self.tokenizer.batch_decode(preds, skip_special_tokens=True)
        decoded_preds = [pred.strip() for pred in decoded_preds]

        return decoded_preds


# 전역 싱글톤
translator = TranslatorService()
