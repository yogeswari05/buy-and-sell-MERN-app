import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import SearchItem from '../pages/SearchItem';
import logo from '../assets/diamondIcon.png';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';
import { useContext } from 'react';
import { SearchContext } from '../context/SearchContext';

const pages = ['Buy', 'Sell', 'Cart', 'Orders', "Deliver Items", "Support"];
const settings = ['Profile', 'LogOut'];

function ResponsiveAppBar(s) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();
  const { user, setUser, isLoading } = useContext(UserDataContext);
  const { query, setQuery } = useContext(SearchContext);

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogOut = () => {
    localStorage.removeItem('token');
    // console.log("REMOVED user in local storage inside responseappbar: ", user);
    setUser(null);
    // console.log("User after logout: ", user);
    navigate('/login');
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'white',
              textDecoration: 'none',
            }}
          >
            Trade Trail
          </Typography>
          {/* small screen view */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={
                  () => {
                    if (page === 'Buy') {
                      navigate('/search');
                    }
                    else if (page === 'Sell') {
                      navigate('/sell');
                    }
                    else if (page === 'Cart') {
                      navigate('/cart');
                    }
                    else if (page === 'Orders') {
                      navigate('/orders');
                    }
                    else if (page === 'Deliver Items') {
                      navigate('/deliver-items');
                    }
                    else if (page === 'Support') {
                      navigate('/support');
                    }
                    else handleCloseNavMenu();
                  }
                }>
                  <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }}>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <img
            src={logo}
            height={50}
            alt="logo"
            width={80}
          />
          <Box sx={{ flexGrow: 1, mx: 2 }}>
            <Link to='/search' >
              <SearchItem />
            </Link>
          </Box>
            <Typography
              variant="h5"
              noWrap
              component={Link}
              // to="/home"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                color: 'white',
                textDecoration: 'none',
              }}
            >
              Trade Trail
            </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => {
                  if (page === 'Cart') {
                    navigate('/cart');
                  }
                  else if (page === 'Orders') {
                    navigate('/orders');
                  }
                  else if (page === 'Deliver Items') {
                    navigate('/deliver-items');
                  }
                  else if (page === 'Sell') {
                    navigate('/sell');
                  }
                  else if (page === 'Buy') {
                    navigate('/search');
                  }
                  else if (page === 'Support') {
                    navigate('/support');
                  }
                }}
                sx={{
                  my: 2,
                  color: 'white',
                  display: 'block',
                  "&:hover": {
                    color: '#ff9800',
                    transition: 'color 0.3s ease',
                  },
                }}
              >
                {page}
              </Button>
            ))}
          </Box>
          {user && (
          // {(
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={user.firstname} src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={() => {
                    if (setting === 'LogOut') {
                      handleLogOut();
                    }
                    else if (setting === 'Profile') {
                      // console.log("Profile clicked");
                      navigate('/profile');
                    }
                  }}>
                    <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
