// Dashboard.tsx
// 로그인 후에 보여지는 페이지 관리

import { useQuery } from '@tanstack/react-query';
// useQuery
// // 서버 데이터 자동 가져오기 + 캐싱 + 로딩/에러 상태
import api, { type User } from '../services/api';
// api 
// // Axios 인스턴스
// User
// // 백엔드 /users/me에서 반환되는 사용자 객체 타입을 받을 컨테이너
import { useAuth } from '../hooks/useAuth';
// useAuth 
// // 로그아웃 기능 제공

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


  return (
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