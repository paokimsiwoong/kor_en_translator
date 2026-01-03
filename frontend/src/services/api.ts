// api.ts
// axios 인스턴스를 생성하고, 공통 HTTP 요청 로직을 여기에 중앙화

// import axios from 'axios';
// @@@ ESLint가 as any를 사용 금지
import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
// // @@@ addTokenInterceptor의 as any 두부분 수정에 사용

// 타입 정의
// export되어 있어서 다른 파일에서 import type { LoginForm } from '../services/api'로 타입만 가져올 수 있다

// 로그인 폼 데이터 구조 정의
export interface LoginForm {
  username: string;
  password: string;
}
// // 백엔드의 OAuth2PasswordRequestForm과 매칭
// // hooks/useAuth.ts의 login mutation에 사용

// 회원가입 폼 데이터 구조 정의
export interface RegisterForm {
  username: string;
  email: string;
  password: string;
}
// // hooks/useAuth.ts의 register mutation에 사용

// 백엔드 /users/me에서 반환되는 사용자 객체 타입 정의
export interface User {
  id: number;
  username: string;
  email: string;
}
// // ProtectedRoute.tsx, Dashboard.tsx에서 useQuery<User>로 사용
// // // /users/me는 hashed_password가 제외된 UserOut을 반환해 
// // // 클라이언트에 hash 값이 노출되지 않도록 하고 있으므로 여기 User 인터페이스도 hash 관련 필드가 없다

export interface TranslateRequest {
  text: string;
  max_length?: number;
  viz?: boolean;
}

export interface TranslateBatchRequest {
  texts: string[];
  max_length?: number;
  viz?: boolean;
}

export interface TranslateResponse {
  original: string | string[];
  translation: string | string[];
  status: 'success';
  viz_url?: string; // 시각화한 경우 html 파일 경로
}


// Axios 인스턴스를 생성해 api에 할당
const api = axios.create({
  // baseURL: 'http://localhost:8000/api/v1', 
  baseURL: '/api', // @@@ Vite 프록시 사용 -> vite.config.ts에 저장된 프록시 대상 경로로 변경
  // 모든 요청에 자동으로 이 URL이 앞에 붙는다
  // // ex: api.get('/users/me')  -->  http://localhost:8000/api/v1/users/me
  headers: { 'Content-Type': 'application/json' },
  // 모든 요청의 기본 헤더 설정
  // validateStatus: (status) => status >= 200 && status < 300, 
  // 기본값 < 300
});


// 인증(로그인 등) 전용 Axios 인스턴스
// // 로그인은 Content-Type 헤더가 application/x-www-form-urlencoded여야 한다
export const authApi = axios.create({
  // baseURL: 'http://localhost:8000/api/v1',
  baseURL: '/api', // @@@ Vite 프록시 사용 -> vite.config.ts에 저장된 프록시 대상 경로로 변경
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  // validateStatus: (status) => status >= 200 && status < 300,
});


// 공통 토큰 인터셉터
// const addTokenInterceptor = (instance: any) => {
//   instance.interceptors.request.use((config: any) => {
// // @@@ ESLint가 as any를 사용 금지
const addTokenInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // config.headers = {
      //   ...config.headers,
      //   Authorization: `Bearer ${token}`,
      // }; 
      // // @@@ config.headers는 단순 객체가 아니라 AxiosHeaders 인스턴스라서 
      // // @@@ 직접 객체 할당이 안 되고 .set 메서드 사용 필수
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  });
};

addTokenInterceptor(api);
addTokenInterceptor(authApi);


export default api;
// export { authApi };  // @@@ export const authApi로 이름 정의 할 떄 export 붙여 두면 여기서 따로 export 명시 안해줘도 된다



// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// api, authApi 둘다 동일한 토큰 인터셉터 사용 ==> 하나로 통일
// 인터셉터: 요청 시 토큰 자동 추가
// api.interceptors.request.use((config) => {
  //   const token = localStorage.getItem('access_token');
  //   if (token) config.headers.Authorization = `Bearer ${token}`;
  //   return config;
  // });
  
// 인증 API에도 토큰 인터셉터 추가 (refresh token 용(/auth/refresh 차후 구현시))
// authApi.interceptors.request.use((config) => {
  //   const token = localStorage.getItem('access_token');
  //   if (token) config.headers.Authorization = `Bearer ${token}`;
  //   return config;
  // });
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@