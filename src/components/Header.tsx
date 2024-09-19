import Navbar from './NavBar';

const Header = () => {
  return (
    <header>
        <Navbar isLoggedIn={false} />
    </header>
  );
};

export default Header;
