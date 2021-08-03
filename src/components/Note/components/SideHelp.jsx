import React from "react";
import { VStack, Box, Icon, Button, Text } from "@chakra-ui/react";
import { CgArrowsExpandDownRight } from "react-icons/cg";
import { BsPersonLinesFill } from "react-icons/bs";
import "./SideHelp.scss";

const SideHelp = () => {
  return (
    <VStack
      width="200px"
      height="300px"
      bg="white"
      position="sticky"
      top="20%"
      right="20%"
      p={3}
    >
      <Box
        bg="white"
        width="30%"
        p={3}
        position="absolute"
        left="-30%"
        top="0%"
        zIndex="3"
      >
        <Icon
          as={BsPersonLinesFill}
          viewBox="0 0 16 16"
          width="2em"
          height="2em"
        />
      </Box>
      <Button bg="#212120" color="white">
        <Icon as={CgArrowsExpandDownRight} transform="rotate(45deg)" mr="2" />
        <Text> Expand Board </Text>
      </Button>
    </VStack>
  );
};

export default SideHelp;
