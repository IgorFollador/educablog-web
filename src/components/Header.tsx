import Navbar from './NavBar';

const Header = ({ isLoggedIn = false}) => {
  return (
    <header>
        <Navbar isLoggedIn={isLoggedIn} />
    </header>
  );
};

export default Header;
