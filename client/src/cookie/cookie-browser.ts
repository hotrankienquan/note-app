import Cookies from 'universal-cookie';

const cookiesBrowser = new Cookies(null, { path: import.meta.env.REACT_URL });

// cookies.set('myCat', 'Pacman');
// console.log(cookies.get('myCat')); // Pacman
export {
    cookiesBrowser
}