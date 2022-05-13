import Cookies from 'universal-cookie';

export const cookies = new Cookies();

export const removeCookies = () => {
  cookies.set('token', '', { path: '/', maxAge: 0 });
  cookies.set('name', '', { path: '/', maxAge: 0 });
  cookies.set('login', '', { path: '/', maxAge: 0 });
  cookies.set('password', '', { path: '/', maxAge: 0 });
};
