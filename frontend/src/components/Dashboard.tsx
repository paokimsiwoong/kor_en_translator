// Dashboard.tsx
// 로그인 후에 보여지는 페이지 관리

import { useState } from 'react';
// useState
// // React 상태 훅

import { useQuery } from '@tanstack/react-query';
// useQuery
// // 서버 데이터 자동 가져오기 + 캐싱 + 로딩/에러 상태
import api, { type User, type TranslateRequest, type TranslateBatchRequest, type TranslateResponse } from '../services/api';
// api
// // Axios 인스턴스
// User
// // 백엔드 /users/me에서 반환되는 사용자 객체 타입을 받을 컨테이너
import { useAuth } from '../hooks/useAuth';
// useAuth 
// // 로그아웃 기능 제공

import { useTranslate } from '../hooks/useTranslate';
// useTranslate
// // 번역 기능 제공

import { Loader2, CopyCheck } from 'lucide-react';

export default function Dashboard() {
  const { logout } = useAuth();
  // Destructuring : useAuth의 반환값 중 필요한 logout만 받아서 사용하고 나머지 무시

  // /users/me 호출 후 결과 캐시에 저장
  // @@@ 자세한 설명은 ProtectedRoute.tsx 확인
  const { data: user } = useQuery<User>({  // 제네릭(<>)으로 반환 타입 지정
    queryKey: ['me'],  // 쿼리 고유 키
    queryFn: async () => {  // 서버 데이터 가져오기 함수 정의
      const { data } = await api.get<User>('/users/me');
      return data;
    },
  });
  // 리액트 쿼리는 캐시에 쿼리 결과를 자동 저장하므로
  // logout으로 캐시가 초기화되기 전까진
  // Dashboard 페이지 첫 방문에만 /users/me API 호출을 하고
  // 이후엔 캐시에 저장된 결과 사용

  // 번역 기능 관련
  const [translateText, setTranslateText] = useState('');
  const [result, setResult] = useState('');
  const [useBatch, setUseBatch] = useState(false);
  const { singleTranslate, singlePending, singleError, batchTranslate, batchPending, batchError } = useTranslate();

  const handleTranslate = async () => {
    if (!translateText.trim()) return;

    // console.log('토큰:', localStorage.getItem('access_token')); 
    if (!localStorage.getItem('access_token')) {
      setResult('토큰이 존재하지 않습니다.');
      return;
    }

    try {
      let response: TranslateResponse;
      
      if (useBatch) {
        // 배치 모드
        response = await batchTranslate({
          texts: [translateText],  // 단일 텍스트를 배열로
          max_length: 512,
          viz: false,
        } as TranslateBatchRequest);
        setResult((response.translation as string[])[0]);  // 첫 번째 결과
      } else {
        // 단일 모드
        response = await singleTranslate({
          text: translateText,
          max_length: 512,
          viz: false,
        } as TranslateRequest);
        setResult(response.translation as string);
      }
    } catch (error) {
      console.error('번역 에러:', error);
      setResult('번역에 실패했습니다.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
  };

  const isPending = singlePending || batchPending;
  const error = singleError || batchError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          <button
            onClick={logout}
            className="text-sm text-red-600 hover:underline"
          >
            로그아웃
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-gray-700">
            안녕하세요, <span className="font-semibold">{user?.username}</span>님!
          </p>
          <p className="text-gray-500 text-sm">
            이메일: <span className="font-mono">{user?.email}</span>
          </p>
        </div>

        {/* 한영 번역 섹션 */}
        <section className="mt-12 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center mr-3 text-lg font-bold">
              🌐
            </span>
            한영 번역기
          </h2>
          
          <div className="space-y-6">
            {/* 입력 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                번역할 텍스트 {useBatch && '(배치 모드)'}
              </label>
              <textarea
                value={translateText}
                onChange={(e) => setTranslateText(e.target.value)}
                placeholder="여기에 한국어 또는 영어를 입력하세요..."
                className="w-full h-32 p-4 border border-gray-300 rounded-xl resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                disabled={isPending}
              />
            </div>

            {/* 버튼 */}
            <div className="flex gap-3">
              <button
                onClick={handleTranslate}
                disabled={isPending || !translateText.trim()}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> 
                    번역 중...
                  </>
                ) : (
                  '번역하기'
                )}
              </button>
              
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={useBatch}
                  onChange={(e) => setUseBatch(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                  disabled={isPending}
                />
                배치 모드
              </label>
            </div>

            {/* 결과 */}
            {result && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">번역 결과</h3>
                  <button
                    onClick={handleCopy}
                    className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    title="결과 복사"
                  >
                    <CopyCheck className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <p className="whitespace-pre-wrap text-gray-900 leading-relaxed">{result}</p>
                </div>
              </div>
            )}

            {/* 에러 */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-sm">오류: {String(error.message || '알 수 없는 오류')}</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

// <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
// Tailwind CSS 클래스들로 공통 레이아웃 설정

//   헤더 + 로그아웃 버튼 영역
//   <div className="flex items-center justify-between mb-4">
//   // flex items-center justify-between: 좌우 양끝 정렬
//     <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
//     // 헤더

//     <button
//       onClick={logout}  // 클릭 시 useAuth의 로그아웃 실행 (토큰 삭제, 캐시 삭제, 로그인 페이지 이동)
//       className="text-sm text-red-600 hover:underline"
//     >
//       로그아웃
//     </button>
//     // 로그아웃 버튼 설정
//   </div> 헤더 + 로그아웃 버튼 영역 종료

//   사용자 정보 표시 영역
//   <div className="space-y-2">
//     <p className="text-gray-700">
//       안녕하세요, <span className="font-semibold">{user?.username}</span>님!
//       // {user?.username}: Optional Chaining -> user가 undefined일 때 크래시 방지
//       // font-semibold: 사용자명 강조
//     </p>
//     <p className="text-gray-500 text-sm">
//       이메일: <span className="font-mono">{user?.email}</span>
//       // font-mono: 이메일은 모노스페이스 폰트
//     </p>
//   </div>
// </div>