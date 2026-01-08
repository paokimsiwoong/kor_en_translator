// Dashboard.tsx
// 로그인 후에 보여지는 페이지 관리

import { useState} from 'react';
// useState
// // React 상태 훅

import { useQuery } from '@tanstack/react-query';
// useQuery
// // 서버 데이터 자동 가져오기 + 캐싱 + 로딩/에러 상태
import api, { type User, type TranslateRequest, type TranslateBatchRequest, type TranslateResponse} from '../services/api';
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

// import { Loader2, Copy, CopyCheck, Plus, Minus, Eye, EyeOff } from 'lucide-react';
import { Loader2, Copy, CopyCheck, Plus, Minus, Eye} from 'lucide-react';
// Loader2
// // 로딩 스피너 아이콘
// // 번역 버튼 내부 isPending일 때 표시
// // animate-spin으로 무한 회전
// Copy
// // 복사 버튼
// CopyCheck
// // 복사 완료 버튼
// // 번역 결과 옆 복사 버튼이 눌려 클립보드에 복사 완료 시 표시되는 아이콘
// Plus
// // 입력란 추가 버튼
// // 눌리면 새로운 입력란 추가
// Minus
// // 입력란 제거 버튼

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

  // 번역 기능 관련 변수들 
  // @@@ React state 및 여기서 사용되는 훅에서 반환되는 값들을 할당
  // const [translateText, setTranslateText] = useState('');
  const [translateTexts, setTranslateTexts] = useState<string[]>(['']);  // 배치모드를 위해 배열로 변경
  // @@@ state 옆의 함수들은 해당 state 업데이트 함수
  // @@@ @@@ useState는 생성된 state와 그 state의 setter(업데이트함수)를 반환한다
  // @@@ @@@ 반환된 state와 setter의 이름을 각각 translateTexts, setTranslateTexts로 정의
  // const [result, setResult] = useState('');
  const [result, setResult] = useState<string[]>([]);  // 배치모드를 위해 배열로 변경
  // @@@ 단일 문장 번역일 때는 배열의 0번 인덱스만 사용하도록 코드를 변경한다
  const [useBatch, setUseBatch] = useState(false);
  const { singleTranslate, singlePending, singleError, batchTranslate, batchPending, batchError} = useTranslate();
  // useTranslate 훅의 반환값들 할당

  const [showViz, setShowViz] = useState(false);  // 시각화 토글
  const [vizUrl, setVizUrl] = useState<string | null>(null);  // viz_url 저장

  // 복사 완료 여부 확인하는 state와 업데이트 함수
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  // // 복사 버튼(Copy 아이콘)들을 렌더링할 떄 여기에 저장된 index에 해당하는 버튼은 복사 완료 버튼(CopyCheck)으로 변경

  // 텍스트 입력란 추가 버튼이 눌릴 시 실행되는 함수
  const addTextInput = () => {
    if (!useBatch) return;  // 배치 모드가 아니면 추가 불가
    setTranslateTexts(prev => [...prev, '']);
    // translateTexts 배열에 '' 추가해 길이 1 증가
    // // 입력창 렌더링 시에 배열 길이에 맞춰서 렌더링할 입력란 개수를 정한다
  };

  // 텍스트 입력란 제거 버튼이 눌릴 시 실행되는 함수
  const removeTextInput = (index: number) => {
    if (translateTexts.length > 1) {
      const newTexts = translateTexts.filter((_, i) => i !== index);
      const newResults = result.filter((_, i) => i !== index);
      setTranslateTexts(newTexts);
      setResult(newResults);
      // 각 배열 마지막 인덱스를 필터링해 배열 길이 1 감소
    }
  };

  // 개별 텍스트 입력란 텍스트 변경 감지 시 실행되는 함수
  const updateText = (index: number, value: string) => {
    // 내용이 변경된 입력창의 index와 변경된 내용을 받아 갱신하는 함수
    const newTexts = [...translateTexts];
    newTexts[index] = value;
    setTranslateTexts(newTexts);
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // 단순히 translateTexts[index] = value;로 기존 state array 내부 element 값을 변경하면
    // React가 값(상태) 변경을 감지하지 못해 새로 렌더링하지 않는다 -> 화면에 값 변경이 반영되지 않는다
    // @@@ React는 === (참조 비교)로 상태 변경 감지
    // @@@ @@@ translateTexts[index] = value; setTranslateTexts(translateTexts);
    // @@@ @@@ 이렇게 하면 oldArray === newArray 결과가 true라서 react는 화면을 새로 렌더링하지 않는다
    // @@@ newTexts = [...translateTexts]; 는 내부 값이 같지만 주소가 다른 새 어레이를 생성하므로
    // @@@ setTranslateTexts(newTexts);를 하면 React가 변경을 감지하고 화면을 새로 렌더링한다.
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  };

  const handleTranslate = async () => {
    // if (!translateText.trim()) return;
    const texts = translateTexts.filter(t => t.trim());  // 빈 텍스트 제거
     if (texts.length === 0) return;

    // console.log('토큰:', localStorage.getItem('access_token')); 
    if (!localStorage.getItem('access_token')) {
      // setResult('토큰이 존재하지 않습니다.');
      setResult(['토큰이 존재하지 않습니다.']);
      // 결과도 배열로 바뀌었으므로 []로 감싸주기
      return;
    }

    try {
      let response: TranslateResponse;
      // let : 블록 스코프 변수 선언 (초기화 x -> undefined 상태)
      // // const도 블록 스코프 변수이지만 const와 다르게 재할당이 가능
      // // if else 에서 조건에 따라 재할당이 필요하므로 let
      
      
      if (useBatch) { // 배치 모드
        // /translate/batch에 요청하고 받은 응답을 response에 할당
        response = await batchTranslate({
          texts,  
          max_length: 512,
          viz: showViz,
        } as TranslateBatchRequest);

        // 응답의 translation 필드를 result state에 입력
        setResult(response.translation as string[]);
        setVizUrl(response.viz_url || null);
      } else { // 단일 모드
        // @@@ 단일 모드인 경우는 배열인 texts의 0번 인덱스만 firstText에 할당해 요청에 사용
        const firstText = texts[0];
        // /translate에 요청하고 받은 응답을 response에 할당
        response = await singleTranslate({
          text: firstText,
          max_length: 512,
          viz: showViz,
        } as TranslateRequest);
        // 응답의 translation 필드를 result state에 입력
        setResult([response.translation as string]);
        setVizUrl(response.viz_url || null);
      }
    } catch (error) {
      console.error('번역 에러:', error);
      setResult(['번역에 실패했습니다.']);
      setVizUrl(null);
    }
  };

  // const handleCopy = () => {
  //   navigator.clipboard.writeText(result);
  // };
  // const handleCopy = (index: number) => {
  //   navigator.clipboard.writeText(result[index] || '');
  // };
  const handleCopy = async (index: number) => {
    try {
      await navigator.clipboard.writeText(result[index] || '');
      setCopiedIndex(index);  // 복사 성공 -> 인덱스 저장 -> 해당 인덱스 버튼은 복사(Copy) 버튼 대신 복사완료(CopyCheck) 버튼으로 변경
      setTimeout(() => setCopiedIndex(null), 5000);  // 일정시간 후 원래대로
    } catch (error) {
      console.error('복사 실패:', error);
    }
  };

  const isPending = singlePending || batchPending;
  const error = singleError || batchError;

  
  return (
    // <div className="min-h-screen min-w-screen bg-linear-to-r from-blue-50 to-indigo-100 p-8">
    // <div className="min-h-screen min-w-screen p-8">
    // @@@ min-h-screen min-w-screen는 App.tsx에 들어가 있으므로 여기선 삭제
    <div className="p-8">
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      {/* <div className="max-w-2xl mx-auto p-8 bg-gray-100 rounded-xl shadow-lg"> */}
        {/* 헤더 + 로그아웃 버튼 영역 */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          <button onClick={logout} className="text-sm font-semibold text-white 
                 bg-linear-to-r from-gray-500 to-gray-600 
                 hover:from-red-600 hover:to-red-700
                 rounded-full shadow-lg hover:shadow-xl 
                 transition-all duration-300 hover:scale-[1.05] 
                 active:scale-[0.98]"
          >
            로그아웃
          </button>
        </div>

        {/* 사용자 정보 표시 영역 */}
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
        {/* <section className="mt-12 bg-linear-to-r from-gray-300 to-gray-400 rounded-2xl shadow-xl p-8 border border-gray-100"> */}
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center mr-3 text-lg font-bold">
              🌐
            </span>
            한영 번역기
          </h2>
          
          {/* 섹션에서 h2를 제외한 부분 */}
          <div className="space-y-6">

            {/* 배치 모드 토글, 문장 입력란 추가/제거 버튼 영역 */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            {/* <div className="flex items-center gap-3 p-3 bg-linear-to-r from-gray-50 to-gray-150 rounded-xl"> */}
              {/* 배치 모드 토글 */}
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer select-none flex-1">
                <input
                  type="checkbox"
                  checked={useBatch}
                  onChange={(e) => {
                    setUseBatch(e.target.checked);
                    if (!e.target.checked && translateTexts.length > 1) {
                      // 배치 모드 끄면 입력란, 결과란 첫 번째만 남김
                      setTranslateTexts([translateTexts[0]]);
                      setResult(result.length > 0 ? [result[0]] : []);
                    }
                  }}
                  className="w-4 h-4 text-blue-600 rounded"
                  disabled={isPending}
                />
                <span>
                  배치 번역 모드
                  {/* {useBatch && translateTexts.length > 1 && (
                    <span className="text-xs text-orange-500 ml-1">(단일 문장 번역 모드로 변경)</span>
                  )} */}
                </span>
              </label>

              {/* 문장 입력란 추가/제거 버튼 */}
              <div className="flex gap-1">
                {/* 추가 버튼 */}
                <button
                  onClick={addTextInput}
                  disabled={!useBatch || isPending}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all group"
                  title={!useBatch ? "복수 문장을 입력하려면 배치 모드를 활성화 하세요" : "입력 추가"}
                >
                  <Plus className="w-4 h-4 group-disabled:opacity-30" />
                </button>

                {/* 제거 버튼(입력란이 2개 이상일때만 조건부 표시), 배열 마지막 원소 제거 */}
                {translateTexts.length > 1 && (
                  <button
                    // 클릭하면 배열 마지막 element index를 removeTextInput 함수에 입력해 제거
                    onClick={() => removeTextInput(translateTexts.length - 1)}
                    disabled={isPending}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="마지막 입력 제거"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center p-3 bg-linear-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl shadow-sm">
              <label className="flex items-center gap-3 text-sm font-semibold text-purple-800 cursor-pointer select-none hover:text-purple-900 transition-colors">
                <input
                  type="checkbox"
                  checked={showViz}
                  onChange={(e) => {
                    setShowViz(e.target.checked);
                    // console.log('시각화 버튼 클릭');
                  }}
                  className="w-4 h-4 text-purple-600 bg-purple-100 border-purple-300 
                            rounded-lg focus:ring-purple-500 focus:ring-2 focus:border-transparent 
                            transition-all duration-200 cursor-pointer shadow-sm
                            hover:shadow-md hover:bg-purple-200"
                  disabled={isPending}
                />
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-purple-600" />
                  Attention score 시각화
                </span>
              </label>
              {showViz && (
                <span className="ml-4 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium animate-pulse">
                  활성화됨 (처리 시간 ↑)
                </span>
              )}
            </div>

            {/* 입력 영역들 */}
            {/* <div className="space-y-4 max-h-96 overflow-y-auto"> */}
            {/* p-1 없으면 입력창 foucs시 좌우 잘림 */}
            <div className="space-y-4 max-h-96 p-1 overflow-y-auto">
              {/* translateTexts 배열 길이에 맞춰서 입력란 복수 생성 */}
              {translateTexts.map((text, index) => (
                <div key={index} className="relative group">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    입력 {index + 1}
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => updateText(index, e.target.value)}
                    placeholder={`문장 ${index + 1}을 여기에 입력하세요...`}
                    className="w-full h-24 p-4 border border-gray-300 bg-linear-to-r from-yellow-50 to-red-50 text-gray-900 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    disabled={isPending}
                  />
                  {/* 입력란 2개 이상일 때, 각 입력란 별 제거 버튼 생성 */}
                  {translateTexts.length > 1 && (
                    <button
                      onClick={() => removeTextInput(index)}
                      className="absolute top-19.5 right-1 p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      title="제거"
                      disabled={isPending}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* 번역 버튼 */}
            <div className="flex gap-3">
              <button
                onClick={handleTranslate}
                disabled={isPending || translateTexts.every(t => !t.trim())}
                className="flex-1 bg-linear-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {/* animate-spin으로 무한 회전 효과 */}
                    번역 중...
                  </>
                ) : (
                  `(${translateTexts.filter(t => t.trim()).length}개) 문장 번역하기`
                )}
              </button>
            </div>

            {/* 결과 영역 */}
            {result.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  번역 결과 ({result.length}개)
                </h3>
                <div className="space-y-3">
                  {/* result 배열 길이에 맞춰서 결과란 복수 생성 */}
                  {result.map((res, index) => (
                    <div key={index} className="p-4 bg-linear-to-r from-green-50 to-blue-50 border rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">결과 {index + 1}</span>
                        {/* 결과 복사 버튼 */}
                        <button
                          onClick={() => handleCopy(index)}
                          disabled={isPending}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-50 rounded-lg transition-all duration-200"
                          title="결과 복사"
                        >
                          {/* 복사 버튼 index가 가장 최근에 눌린 버튼이면 복사 완료 아이콘, 아니면 복사 아이콘 렌더링 */}
                          {copiedIndex === index ? (
                            <CopyCheck className="w-4 h-4 text-green-600 animate-pulse" />  // ✅ 복사 완료!
                          ) : (
                            <Copy className="w-4 h-4" />  // ✅ 복사 전!
                          )}
                        </button>
                      </div>
                      <p className="whitespace-pre-wrap text-gray-900 leading-relaxed text-sm">{res}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 시각화 섹션 */}
            {vizUrl && showViz && result.length > 0 && (
              <div className="mt-8 p-6 bg-linear-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-purple-900 mb-6 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Cross Attention Visualization ({result.length}개)
                </h3>

                {/* 1열 세로 스크롤 */}
                <div className="flex flex-col gap-4 max-h-160 overflow-y-auto p-4 bg-white rounded-xl border shadow-md scrollbar-thin scrollbar-thumb-purple-300">
                  {result.map((_, index) => (
                    <div key={index} className="w-full shrink-0">
                      <div className="text-center mb-2">
                        <span className="text-sm font-medium text-purple-800">결과 #{index + 1}</span>
                      </div>
                      <iframe
                        src={`http://localhost:8000${vizUrl}/decoder_src_${index}.html`}
                        className="w-full h-128 border rounded-lg shadow-sm"
                        sandbox="allow-scripts allow-popups"
                        title={`Attention Map ${index + 1}`}
                      />
                      <div className="mt-4 flex gap-4 text-sm text-purple-700">
                        <a href={`http://localhost:8000${vizUrl}/decoder_src_${index}.html`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Cross Attention
                        </a>
                        <a href={`http://localhost:8000${vizUrl}/encoder_self_${index}.html`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Encoder Self
                        </a>
                        <a href={`http://localhost:8000${vizUrl}/decoder_self_${index}.html`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Decoder Self
                        </a>
                        <span className="text-gray-500">| 별도 페이지에서 확인하기 </span>
                      </div>
                    </div>
                  ))}
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