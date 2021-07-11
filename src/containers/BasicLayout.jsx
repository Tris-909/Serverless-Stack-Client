import React, { useState, useEffect } from "react";
import { useAppContext } from "../libs/context-libs";
import { onError } from "../libs/error-libs";
import { API } from "aws-amplify";
import {
  VStack,
  Text,
  Divider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import NavBar from "../components/NavBar/NavBar";
import { LinkWrapper } from "../components/LinkWrapper/LinkWrapper";
import "./BasicLayout.css";

const Home = (props) => {
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
      <NavBar onOpen={onOpen} />
      {props.children}
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
