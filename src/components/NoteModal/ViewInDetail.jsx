import React, { useState, useRef } from "react";
import {
  Box,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";

const ViewInDetail = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} scrollBehavior="outside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>abc</ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ViewInDetail;
