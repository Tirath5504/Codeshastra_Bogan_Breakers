import React, { useState } from "react";
// import Logo from "../Assets/Logo.svg";
import { Box, Drawer, Divider, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { HiOutlineBars3 } from "react-icons/hi2";
import "./css/Navbar.css";

const Navbar = () => {
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
                <ListItemButton to={item.path}>
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
