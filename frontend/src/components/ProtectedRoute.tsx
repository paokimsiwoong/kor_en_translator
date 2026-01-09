// ProtectedRoute.tsx
// 인증이 필요한 페이지를 보호하는 가드 컴포넌트
// /dashboard 같은 페이지에 감싸서 토큰 유효성 검사 + 자동 로그인 리다이렉트 실행

import { Navigate } from 'react-router-dom';
// Navigate
// // 리다이렉트에 사용
import { useQuery } from '@tanstack/react-query';
// useQuery
// 사용자 정보 확인(/users/me) 호출에 사용
import api, { type User } from '../services/api';
// api 
// // Axios 인스턴스
// User
// // 백엔드 /users/me에서 반환되는 사용자 객체 타입을 받을 컨테이너

interface ProtectedRouteProps {
  children: React.ReactNode;
  // children: 자식 컴포넌트 
  // // ex: <ProtectedRoute><Dashboard /></ProtectedRoute>의 Dashboard
  // React.ReactNode: React가 렌더링할 수 있는 모든 것 (JSX, 컴포넌트, 문자열 등)
}

// children을 렌더하기 전에 백엔드의 /users/me로 현재 사용자 확인
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // 매개변수(함수 인자) 구조 분해 (destructuring)
  // // function ProtectedRoute(props: ProtectedRouteProps) 이렇게 받으면 
  // // ProtectedRouteProps인 props가 함수 인자로 들어오고
  // // props.children으로 children에 접근하지만
  // // function ProtectedRoute({ children }: ProtectedRouteProps) 로 두면
  // // 바로 children으로 사용 가능


  // React Query의 useQuery 실행
  // // 서버에서 데이터 가져오고, 캐싱하고, 로딩/에러 상태까지 자동으로 관리해 주는 훅
  const { data: user, isLoading, isError } = useQuery<User>({ // 제네릭(<>)으로 반환 타입 지정
    queryKey: ['me'], 
    // 쿼리 고유 키
    // // 같은 키를 쓰면 React Query가 이미 캐시된 값이 있으면 그걸 재사용하고 필요할 때만 다시 서버에 요청한다
    // // // 다른 곳에서도 useQuery(['me'], ...)로 쿼리 고유 키를 똑같이 쓰면 같은 사용자 정보 캐시를 공유
    queryFn: async () => {
      const { data } = await api.get<User>('/users/me');
      return data;
    },
    // queryFn
    // // 실제로 서버에서 데이터 가져오는 함수
    // // 이 페이지 컴포넌트가 마운트될 때, 그리고 필요할 때마다 React Query가 자동으로 호출
    // // 반환되는 data 값이 곧 useQuery가 돌려주는 객체
    // // // 객체를 전부 사용하지 않고 destructuring해 필요한 필드만 뽑아서 할당 중
    // // // // @@@ queryFn에서 반환되는 data 객체와 그 객체안의 data 필드(지역변수 user에 할당)는 다른 것
    retry: 0,
  });
  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  // useQuery의 반환값의 형태는
  // {
    // data: { id, username, email } | undefined,
    // isLoading: boolean,
    // isError: boolean,
    // error: unknown,
    // // ...
    // }
    // 로 객체 형태
    // 이 객체를 Destructuring(구조 분해 할당 - 여러 필드를 가진 객체를 분해해 필드들 여러개로 할당) 한다
    // // { data, isLoading, isError } = useQuery...
    // 이 때 꺼내오는 필드를 받는 지역 변수의 이름을 바꿔주고 싶을 때 
    // 필드이름: 지역변수이름 형태로 코드 작성
    // // data: user
    // // 밑의 자바스크립트에서 data 대신 user, user?.username(/dashboard 예시)로 되면 읽기 더 자연스럽다
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


  // 조건부 렌더링 (useQuery가 반환한 로딩중, 에러, 정상 값 조건에 따라 반환값 변경)

  // 로딩중
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-600">인증 상태 확인 중...</span>
      </div>
    );
  }

  // 에러 발생 시 로그인 페이지로 리다이렉트
  if (isError || !user) {
    return <Navigate to="/login" replace />;
    // replace: 히스토리 스택 교체 
    // // 로그인 페이지로 이동 된 뒤에 뒤로가기 시 이 페이지로 다시 돌아오는 것을 막는다
    // // // 막지 않으면 다시 이 페이지로 돌아와 다시 로그인 페이지로 리다이렉트 되는 루프 발생
  }

  // 인증 성공 시 자식 페이지(ex: /dashboard) 표시
  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  return children;
  // return <>{children}</>;
  // 굳이 <></>로 감쌀 필요 없다
  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
}
