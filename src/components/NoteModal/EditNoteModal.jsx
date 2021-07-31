import React from "react";
import CommonModal from "./CommonModal";
import {
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  HStack,
  Image,
  Box,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

// This is not a re-usable component, This is just a way to manage and swap between many different modals in the same page
const EditNoteModal = ({
  isOpen,
  onClose,
  initialFocusRef,
  finalFocusRef,
  header,
  setHeader,
  initialRef,
  content,
  setContent,
  deleteImage,
  previewImage,
  note,
  clearFileHandler,
  handleFileChange,
  handleSubmit,
}) => {
  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={initialFocusRef}
      finalFocusRef={finalFocusRef}
    >
      <ModalHeader>Edit</ModalHeader>
      <ModalCloseButton />
      <ModalBody pb={6}>
        <form>
          <FormControl>
            <FormLabel>Content</FormLabel>
            <Input
              value={header}
              onChange={(e) => setHeader(e.target.value)}
              ref={initialRef}
              placeholder="Note Header"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Content</FormLabel>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              ref={initialRef}
              placeholder="Write something"
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Image</FormLabel>
            {!deleteImage && (
              <HStack alignItems="flex-start">
                <Image
                  src={
                    note.attachment && !previewImage
                      ? `https://notes-app-upload-tritran.s3.ap-southeast-2.amazonaws.com/private/${note.userId}/${note.attachment}`
                      : previewImage
                  }
                  alt="previewImage"
                  border="1px solid #e2e8f0"
                  width="350px"
                  height="200px"
                  marginBottom={3}
                />
                <Box
                  cursor="pointer"
                  marginInlineStart={0}
                  p={4}
                  border="1px solid #e2e8f0"
                  onClick={() => clearFileHandler()}
                >
                  <CloseIcon width="16px" height="16px" />
                </Box>
              </HStack>
            )}

            <input onChange={handleFileChange} type="file" />
          </FormControl>
        </form>
      </ModalBody>

      <ModalFooter>
        <Button
          bg="black"
          color="white"
          mr={3}
          onClick={(e) => handleSubmit(e)}
        >
          Save
        </Button>
      </ModalFooter>
    </CommonModal>
  );
};

export default EditNoteModal;
