import React from "react";
import CommonModal from "./CommonModal";
import {
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";

const DetailNoteModal = ({
  isOpen,
  onOpen,
  onClose,
  note,
  setCurrentModalState,
  currentModalState,
}) => {
  const onOpenDetailModal = () => {
    setCurrentModalState("detail");
    onOpen();
  };

  return (
    <>
      <Search2Icon
        color="white"
        marginInlineEnd="0px"
        position="absolute"
        top="34%"
        left="33%"
        onClick={onOpenDetailModal}
      />
      {currentModalState === "detail" && (
        <CommonModal isOpen={isOpen} onClose={onClose}>
          ABC
        </CommonModal>
      )}
    </>
  );
};

export default DetailNoteModal;
