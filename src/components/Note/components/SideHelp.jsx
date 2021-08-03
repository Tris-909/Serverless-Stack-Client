import React from "react";
import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { BiUpArrow, BiNote, BiWindow } from "react-icons/bi";
import "./SideHelp.scss";

const SideHelp = () => {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<BiUpArrow color="black" />}
        position="sticky"
        top="90%"
        left="95%"
        borderRadius="full"
        className="animation"
      />

      <MenuList>
        <MenuItem icon={<BiNote />}>New Note</MenuItem>
        <MenuItem icon={<BiWindow />}>Expand Board</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default SideHelp;
