import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

const links = [
  { id: 1, url: '/', text: 'home' },
  { id: 3, url: 'products', text: 'Houses' },
  { id: 4, url: 'cart', text: 'favourite' },
  { id: 5, url: 'checkout', text: 'checkout' },
  {id:7, url:'CreatePost', text:'create post'},
  { id: 2, url: 'about', text: 'about' },
];

const NavLinks = () => {
  const user = useSelector((state) => state.userState.user);
  return (
    <>
      {links.map((link) => {
        const { id, url, text } = link;
        if ((url === 'checkout' || url === 'orders' || url === 'CreatePost' || url === 'cart' ) && !user) return null;
        return (
          <li key={id}>
            <NavLink className='capitalize' to={url}>
              {text}
            </NavLink>
          </li>
        );
      })}
    </>
  );
};
export default NavLinks;
