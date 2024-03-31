import React, { useState } from "react";
// import Logo from "../Assets/Logo.svg";
import { Box, Drawer, Divider, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { HiOutlineBars3 } from "react-icons/hi2";
import { useNavigate } from 'react-router-dom'
import "./css/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const menuOptions = [
    {
      text: "Home",
      path: '/video',
    },
    {
      text: "Report",
      path: '/report',
    },
    {
      text: "See Guide",
      path: '/guide',
    },
    {
      text: 'Log Out'
    }
  ];
  return (
    <nav>
      <div className="nav-logo-container">
        {/* <img src={Logo} alt="" /> */}
      </div>
      <div className="navbar-menu-container">
        <HiOutlineBars3 onClick={() => setOpenMenu(true)} />
      </div>
      <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor="right">
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setOpenMenu(false)}
          onKeyDown={() => setOpenMenu(false)}
        >
          <List>
            {menuOptions.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => {
                  if (item.text === 'Log Out') {
                    localStorage.removeItem('authToken');
                    navigate('/login');
                  }
                }} to={item.path}>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
    </nav>
  );
};

export default Navbar;
