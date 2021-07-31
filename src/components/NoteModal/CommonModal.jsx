import React from "react";
import { Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";

const CommonModal = (props) => {
  const { isOpen, onClose } = props;

  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} {...props}>
        <ModalOverlay />
        <ModalContent>{props.children}</ModalContent>
      </Modal>
    </>
  );
};

export default CommonModal;
