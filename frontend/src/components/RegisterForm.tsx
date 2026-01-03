// RegisterForm.tsx
// 회원가입 페이지 UI 및 관련 데이터 관리

import { useState } from 'react';
// useState
// // React 상태 훅 -> form 데이터 관리
import { useAuth } from '../hooks/useAuth';
// useAuth 
// // 회원가입 로직(register.mutate) + 상태(isPending, error) 제공
import { Link } from 'react-router-dom';
// Link
// // 로그인 페이지 연결에 필요
import { Mail, Lock, User, Loader2 } from 'lucide-react';
// 아이콘 컴포넌트
// // 입력란 옆에 표시
import type { RegisterForm } from '../services/api';
// RegisterForm
// TypeScript Generic(<>) 설정에 사용

import { type AxiosError } from 'axios';
// @@@ ESLint가 as any를 사용 금지 -> error as any 부분 수정에 AxiosError 사용

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// 422(pydantic validation error) 에러의 detail이 400 에러의 detail과 달리 array여서
// 따로 처리하지 않으면 에러가 발생해 화면 전체 렌더링이 날라간다
interface FastAPIValidationError {
  type: string;
  loc: string[];
  msg: string;
  input: any;
  ctx: Record<string, any>;
}

interface FastAPIErrorResponse {
  detail: string | FastAPIValidationError[];
  // 일반적인 400 error일 경우 string,
  // pydantic validation error일 경우 FastAPIValidationError 타입 어레이로 받을 수 있다
}

const getErrorMessage = (error: unknown): string => {
  try {
    const err = error as AxiosError<FastAPIErrorResponse>;
    const detail = err.response?.data?.detail;
    
    // pydantic validation error일 경우 array
    if (Array.isArray(detail)) {
      return detail
      .map((item: FastAPIValidationError) => item.msg)
      .filter(Boolean)
      .join(', ');
      // array 각 원소(FastAPIValidationError)의 msg만 남긴 뒤(map)
      // join으로 하나의 string으로 합친다
    }
    
    return String(detail || err.message || '회원가입 실패');
  } catch {
    return '회원가입 중 오류 발생';
  }
};
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

// RegisterForm 컴포넌트 선언
export default function RegisterForm() {
  const [form, setForm] = useState<RegisterForm>({ // <RegisterForm>로 이 상태는 RegisterForm 타입이라고 명시
    username: '',
    email: '',
    password: '',
  });
  // 폼 데이터 초기화, 이후 사용자 입력을 여기에 저장

  const { register, isPending, error, isError } = useAuth();
  // Destructuring : useAuth의 반환값 중 필요한 것들만 받아서 사용하고 나머지 무시
  // register.mutate()로 요청, isPending으로 로딩 상태 받음

  // DRY 코드
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  // 모든 입력란에서 공통으로 쓰이는 입력 이벤트 핸들러
  // // 하나의 함수로 username, email, password 3개를 모두 처리 (각 입력란 input 블록의 onChange에 공통으로 사용)
  // e: React.ChangeEvent<HTMLInputElement>
  // // input 요소의 change 이벤트 타입
  // // // e.target = <input> 요소
  // // // e.target.name = "username" | "email" | "password"
  // // // e.target.value = 사용자 입력값
  // 동적 속성 접근 [e.target.name] (JavaScript의 Computed Property Names (ES6) 문법)
  // // input의 name 속성값에 따라 동적으로 키 설정
  // 함수형 업데이트 (prev) => ...
  // // prev = 이전 form 상태
  // // ...prev 는 prev 값 복사
  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  // @@@ 여기서 e.target.name, e.target.value로 사용되는 블록의 name과 value 속성을 사용하므로
  // @@@ onChange={handleChange} 를 사용하기 위해서는
  // @@@ 반드시 name, value 속성이 있어야 한다
  // @@@ @@@ name="username" 으로 name 속성이 없을 경우 e.target.name이 undefined가 되어
  // @@@ @@@ 입력된 value가 username에 저장되지 않고 undefined에 저장된다
  // @@@ @@@ @@@ { username: '', password: '' }이 { username: '', password: '', undefined: 'a' } 와 같이 변경
  // @@@ @@@ 따라서 form의 username 자체는 변화가 없으므로 화면에 변화가 없다
  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // <form>의 기본 동작(전체 페이지 새로고침)을 막는다

    // if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
    //   return;
    // }
    // // register.mutate()가 자동으로 빈 값도 처리해주므로
    // // 클라이언트 검증을 지우고 서버에서 검증하도록 변경하는게 React Query 철학에 맞다
    // // // 네트워크 요청 자체를 막지 않고 무조건 요청 보내고, 서버 응답에 따라 상태 변경

    console.log('📤 회원가입 요청:', form);  // 1️⃣ 요청 확인

    register.mutate(form);
    // register.mutate(form, {
    //     onError: (error) => {
    //       console.log('❌ register.onError:', error);  // 2️⃣ 에러 잡히나?
    //     },
    //     onSuccess: (data) => {
    //       console.log('✅ 회원가입 성공:', data);  // 3️⃣ 성공?
    //     },
    //     onSettled: () => {
    //       console.log('🔄 register 상태:', { 
    //         isError: register.isError, 
    //         error: register.error,
    //         isPending: register.isPending 
    //       });  // 4️⃣ 최종 상태
    //     }
    //   });
    // register.mutate(form)으로 회원가입 요청
    // // React Query가 백엔드 /auth/register으로 요청 전송
    // // 성공 시 localStorage 저장 + /login 이동은 useAuth.onSuccess에서 처리
  };

  return (
    <div className="p-8">
      <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">회원가입</h1>
          <p className="text-gray-500 mt-2">새 계정을 만들어 주세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 이메일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* 사용자명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">사용자명</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}  // useAuth 훅에서 가져옴
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isPending ? (  // useAuth 훅에서 가져옴
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>회원가입 중...</span>
              </>
            ) : (
              <span>회원가입</span>
            )}
          </button>
        </form>

        {isError && error && (  // useAuth 훅에서 가져옴
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              {/* {(error as any)?.response?.data?.detail || error.message || '회원가입에 실패했습니다.'} */}
              {/* {(error as AxiosError<{ detail: string }>)?.response?.data?.detail || error.message || '회원가입에 실패했습니다.'} */}
              {getErrorMessage(error)}
            </p>
          </div>
        )}

        {/* <p className="mt-4 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            로그인
          </Link>
        </p> */}
        <p className="mt-6 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{' '}
          <Link 
            to="/login" 
            className="font-medium text-blue-600 hover:text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}

// 반환값 주석은 LoginForm.tsx 주석 확인(거의 구조 동일)