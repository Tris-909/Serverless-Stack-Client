import React, { useState, useEffect } from "react";
import { useAppContext } from "../libs/context-libs";
import { onError } from "../libs/error-libs";
import { API } from "aws-amplify";
import {
  Grid,
  GridItem,
  HStack,
  VStack,
  Text,
  Box,
  Button,
  Icon,
  Divider,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/react";
import { LinkWrapper } from "../components/LinkWrapper/LinkWrapper";
import "./Home.css";

const Home = () => {
  const { isAuthenticated } = useAppContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    onPageRender();
  }, [isAuthenticated]);

  const onPageRender = async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      const notes = await loadNotes();
      setNotes(notes);
    } catch (error) {
      onError(error);
    }

    setIsLoading(false);
  };

  const loadNotes = async () => {
    return API.get("notes", "/notes");
  };

  return (
    <div className="Home">
      <HStack
        justifyContent="space-between"
        flexDirection="row"
        px={6}
        py={4}
        className="navbar"
      >
        <HStack alignItems="center">
          <Icon
            color="white"
            cursor="pointer"
            boxSize={7}
            as={HamburgerIcon}
            onClick={onOpen}
          />
          <Text className="logo" pl={6}>
            <LinkWrapper to="/">Your Words</LinkWrapper>
          </Text>
        </HStack>
        <Text color="white" fontSize="18px">
          <LinkWrapper to="/auth">Sign Out</LinkWrapper>
        </Text>
      </HStack>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <VStack>
            <Text py={2} className="logo" textAlign="center">
              <LinkWrapper to="/">Your Words</LinkWrapper>
            </Text>
            <Divider />
          </VStack>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Home;
