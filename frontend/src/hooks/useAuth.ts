// useAuth.ts
// 로그인/로그아웃 로직을 한 곳에 모아둔 React 커스텀 훅
// // 컴포넌트에서는 폼 상태 관리 + UI에만 집중하고 
// // 네트워크 요청, 토큰 저장, 캐시 무효화, 라우팅 같은 부수 효과(side effect)는 useAuth에 숨겨둔다
// 이렇게 분리하면
// // 나중에 로그인 API가 바뀌어도 useAuth만 고치면 되고
// // 여러 컴포넌트에서 동일한 패턴으로 간단하게 인증 기능을 쓸 수 있다

import { useMutation, useQueryClient } from '@tanstack/react-query';
// useMutation
// // 서버에 로그인 요청 같은 “변경 요청(POST/PUT/DELETE)”을 보낼 때 쓰는 React Query 훅
// // 성공/실패/로딩 상태(isPending, isError, error 등)를 자동으로 관리
// useQueryClient
// // React Query의 **전역 캐시(queryClient)**에 접근하기 위한 훅
// // invalidateQueries로 특정 쿼리를 다시 가져오게 만들거나, clear()로 전체 캐시를 지울 수 있다

import api, { authApi, type LoginForm, type RegisterForm } from '../services/api';
// api
// // Axios 인스턴스.
// // // baseURL, 기본 헤더, Authorization 인터셉터 등이 설정되어 있다고 가정하는 HTTP 클라이언트
// type { LoginForm }
// // LoginForm은 타입(인터페이스)이기 때문에 type-only import로 가져온다
// // LoginForm 안에는 username, password 같은 필드 타입 정의

import { useNavigate } from 'react-router-dom';
// useNavigate
// // react-router-dom의 훅
// // 코드에서 navigate('/dashboard')처럼 호출해서 프로그래밍적으로 페이지 이동을 할 수 있게 해 준다


interface AuthResponse {
  access_token: string;
}


// useAuth 
// // 컴포넌트에서 const { login, logout } = useAuth()처럼 호출해서 인증 관련 기능을 쓰는 커스텀 훅
export function useAuth() {
  const queryClient = useQueryClient();
  // queryClient는 React Query의 전역 캐시 객체
  // // queryClient.invalidateQueries({ queryKey: ['me'] })처럼 써서 /users/me 같은 데이터를 새로 불러오게 만들 수 있다

  const navigate = useNavigate();
  // navigate는 로그인 성공 후 /dashboard로, 로그아웃 후 /login으로 router 이동할 때 사용

  // login mutation 정의
  const login = useMutation({
    // useMutation
    // // 로그인 요청 하나에 대한 상태 + 로직을 담는 객체
    // 반환값 login
    // // login.mutate(form) : 실제로 로그인 요청을 보내는 함수
    // // login.isPending : 요청 중인지 여부
    // // login.isError, login.error : 에러 여부와 에러 객체
    // // login.data : 성공 시 서버에서 반환한 데이터

    // mutationFn
    // // login.mutate(form)을 호출하면 실행되는 함수 정의
    mutationFn: async (form: LoginForm) => {
      // 함수 인자 form: LoginForm
      // // LoginForm 타입에 맞는 객체 ({ username: string; password: string } 같은 형태)
     
      
      // const { data } = await api.post<{ access_token: string }>('/auth/login', form);
      // api.post('/auth/login', form)
      // // 백엔드의 /auth/login 엔드포인트로 POST 요청
      // // // form은 body로 전송
      // <{ access_token: string }>
      // // 서버 응답 타입을 제네릭으로 지정
      // // // data.access_token이 문자열이라는 것을 TypeScript에 알려준다
      // const { data } = await api.post<AuthResponse>('/auth/login', form);
      // @@@ 서버 응답 타입을 AuthResponse 인터페이스 사용하게 변경
      
      // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      // @@@ form 그대로 사용 시 422 에러 발생
      // const params = new URLSearchParams(form as any);
      // // { username: "test", password: "123" } 형태의 dict로 되어 있는 form을 
      // // application/x-www-form-urlencoded 형식 요구사항에 맞게
      // // "username=test&password=123" 와 같은 형태로 변환
      // // // ??? as any 이유: LoginForm의 value가 string | undefined일 수 있어서 TypeScript가 까다롭게 체크 ???
      // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      // @@@ ESLint가 as any를 사용 금지
      const params = new URLSearchParams({
        username: form.username,
        password: form.password,
      });
      // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      
      const { data } = await authApi.post<AuthResponse>('/auth/login', params);
      // @@@ api 기본 헤더 application/json를 사용하면 422 에러 발생
      // @@@ @@@ application/x-www-form-urlencoded를 사용하기 위해 authApi 사용
      // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      
      // 반환되는 data가 mutation의 결과(login.data)
      return data;
      // // onSuccess의 첫 번째 인자인 data로도 사용
    },

    // onSuccess
    // // 로그인 성공 후에만 실행되는 후처리 로직
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access_token);
      // 브라우저 로컬 저장소에 JWT(access_token)를 저장
      // // services/api.ts에서 Axios 요청 인터셉터가 이 토큰을 읽어 Authorization: Bearer <token> 헤더를 자동으로 붙이도록 설정되어 있다

      queryClient.invalidateQueries({ queryKey: ['me'] });
      // React Query에 캐싱된 'me' 쿼리(/users/me 같은 현재 유저 정보)를 무효 처리(--> 새로 캐시 갱신 필요) 해서 다시 불러오게 한다
      // ex: 대시보드 화면에서 useQuery(['me'], ...)를 쓰고 있으면, 자동으로 새 토큰으로 /users/me를 다시 요청해서 최신 사용자 정보를 가져온다
      
      navigate('/dashboard');
      // 로그인 성공 후 대시보드 페이지로 리다이렉트
    },
  });

  // register mutation 정의
  const register = useMutation({
    mutationFn: async (form: RegisterForm) => {
      const { data } = await api.post<AuthResponse>('/auth/register', form);
      return data;
    },
    onSuccess: () => {
      // 회원가입 성공 → 로그인 페이지로 이동 (자동 로그인 안 함)
      navigate('/login');
    },
  });

  // logout 함수 정의
  const logout = () => {
    localStorage.removeItem('access_token');
    // 브라우저에서 저장된 토큰을 삭제
    // // 이후 요청부터는 Authorization 헤더가 붙지 않는다
    queryClient.clear();
    // React Query 캐시에 저장된 모든 쿼리 결과를 삭제
    // // 특히 'me' 같은 사용자 정보, 개인화 된 데이터 캐시가 모두 지워져서, 로그아웃 후 이전 유저 데이터가 남아있지 않게 된다
    navigate('/login');
    // 로그아웃 후 로그인 페이지로 리다이렉트
  };

  // login의 상태들 명시적 반환
  return { 
    // mutation 객체들
    login, 
    register,

    // useMutation의 상태들 추가 (로그인 우선, 회원가입도 필요시 사용)
    isPending: login.isPending || register.isPending,
    isError: login.isError || register.isError,
    error: login.error || register.error,

    // 액션 함수
    logout,
  };
  // // return 되는 값들은
  // // useAuth()를 사용하는 컴포넌트 입장에서
  // // const { login, logout, isPending, isError, error } = useAuth(); 와 같이 쓰인다
  // // login
  // // // login.mutate(form)으로 로그인 요청을 보낼 수 있는 mutation 객체 전체
  // // // login.data, login.reset() 같은 것도 필요하면 사용 가능
  // // logout
  // // // 호출하면 바로 토큰 삭제 + 캐시 삭제 + /login 이동까지 한 번에 해 주는 함수
  // // isPending
  // // // 로그인 요청이 진행 중이면 true
  // // // 버튼 비활성화, 스피너 표시(요청이 진행중임을 유저에게 보이기 위한 로딩 아이콘 등) 등에 사용
  // // isError, error
  // // // 로그인 요청이 실패했는지 여부와 구체적인 에러 객체
  // // // error.response?.data?.detail 같은 식으로 서버에서 온 에러 메시지를 화면에 보여 줄 수 있다

}


