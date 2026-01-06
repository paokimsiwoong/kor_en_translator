// useTranslate.ts
// 번역 로직을 한 곳에 모아둔 React 커스텀 훅

import { useMutation, useQueryClient } from '@tanstack/react-query';

import api, { type TranslateRequest, type TranslateBatchRequest, type TranslateResponse, type VizResponse } from '../services/api';
// api
// // Axios 인스턴스.
// // // baseURL, 기본 헤더, Authorization 인터셉터 등이 설정되어 있다고 가정하는 HTTP 클라이언트
// { type TranslateRequest, type TranslateBatchRequest, type TranslateResponse }
// // 번역에 사용하는 요청과 응답 interfaces


export const translateText = async (data: TranslateRequest): Promise<TranslateResponse> => {
  const response = await api.post('/translate', {
    text: data.text,
    max_length: data.max_length ?? 512,  // ?? 512 없으면 해당 필드가 undefined -> backend 에러를 막기 위해 512 변환
    viz: data.viz ?? false,
  });
  return response.data;
};

export const translateBatch = async (data: TranslateBatchRequest): Promise<TranslateResponse> => {
  const response = await api.post('/translate/batch', {
    texts: data.texts,
    max_length: data.max_length ?? 512,  // ?? 512 없으면 해당 필드가 undefined -> backend 에러를 막기 위해 512 변환
    viz: data.viz ?? false,
  });
  return response.data;
};

export const getVizHtml = async (htmlUrl: string): Promise<VizResponse> => {
  const response = await api.get<VizResponse>(htmlUrl);
  return response.data;
};


// useTranslate
// // 컴포넌트에서 const { singleTranslate, singlePending, singleError } = useTranslate()처럼 호출해서 인증 관련 기능을 쓰는 커스텀 훅
export const useTranslate = () => {
  const queryClient = useQueryClient();

  // 단일 번역 mutation 정의
  const singleTranslate = useMutation({
    mutationFn: translateText,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translations'] });
    },
  });

  // 배치 번역 mutation 정의
  const batchTranslate = useMutation({
    mutationFn: translateBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translations'] });
    },
  });

  const getViz = useMutation({
    mutationFn: getVizHtml
  });

  return {
    // singleTranslate: singleTranslate.mutate,
    // @@@ mutate는 응답 데이터를 onSuccess 안에서만 사용 가능하고
    // @@@ 반환값은 void이므로 Dashboard.tsx에서 응답 데이터 접근 불가능
    singleTranslate: singleTranslate.mutateAsync,
    // @@@ Dashboard.tsx에서 응답 데이터를 직접 사용하려면 mutate가 아니라 mutateAsync를 써야 한다
    singlePending: singleTranslate.isPending,
    singleError: singleTranslate.error,
    
    // batchTranslate: batchTranslate.mutate,
    batchTranslate: batchTranslate.mutateAsync,
    batchPending: batchTranslate.isPending,
    batchError: batchTranslate.error,

    getViz: getViz.mutateAsync,
    vizPending: getViz.isPending,
    vizError: getViz.error,
  };
// return값을 받는 쪽에서 단일 번역할 경우 
// api.post('/v1/translate', data)를 하는 singleTranslate: singleTranslate.mutate를 사용하고
// 배치 번역의 경우
// api.post('/v1/translate/batch', data)를 하는 batchTranslate: batchTranslate.mutate를 사용
};