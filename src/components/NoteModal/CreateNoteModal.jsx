import React, { useState, useRef } from "react";
import CommonModal from "./CommonModal";
import {
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  ModalFooter,
  Button,
  Icon,
  Image,
  HStack,
  Box,
} from "@chakra-ui/react";
import { SmallAddIcon, CloseIcon } from "@chakra-ui/icons";
import config from "config";
import { API } from "aws-amplify";
import { uploadToS3 } from "libs/awsLib";
import { onError } from "libs/error-libs";

const CreateNoteModal = ({ isOpen, onOpen, onClose, fetchLists }) => {
  const [header, setHeader] = useState("");
  const [content, setContent] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const file = useRef(null);
  const inputRef = useRef();

  const handleFileChange = (e) => {
    file.current = e.target.files[0];
    setPreviewImage(URL.createObjectURL(e.target.files[0]));
  };

  const clearInputState = () => {
    setHeader("");
    setContent("");
    file.current = {};
  };

  const clearFileHandler = () => {
    setPreviewImage(null);
    inputRef.current.value = "";
    console.log("file", inputRef.current.value);
  };

  const createNote = (note) => {
    return API.post("notes", "/notes", {
      body: note,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (file.current && file.current.size > config.maxAttachmentSize) {
      alert(
        `Please pick up a file smaller than ${
          config.maxAttachmentSize / 1000000
        } MB`
      );
      return;
    }

    try {
      const attachment = file.current ? await uploadToS3(file.current) : null;
      await createNote({ header, content, attachment });
      clearInputState();
      fetchLists();
      onClose();
    } catch (error) {
      onError(e);
    }
  };

  return (
    <>
      <Button position="sticky" left="95%" top="92%" onClick={onOpen}>
        <Icon as={SmallAddIcon} boxSize={8} />
      </Button>
      <CommonModal
        isOpen={isOpen}
        onClose={onClose}
        customeMaxWContent="60rem"
        scrollBehavior="outside"
      >
        <ModalHeader>Create a new note</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form>
            <FormControl>
              <FormLabel>Content</FormLabel>
              <Input
                value={header}
                onChange={(e) => setHeader(e.target.value)}
                placeholder="Note Header"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Content</FormLabel>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write something"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Image</FormLabel>
              {previewImage && (
                <HStack alignItems="flex-start">
                  <Image
                    src={previewImage}
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
              <input
                onChange={handleFileChange}
                type="file"
                id="file"
                ref={inputRef}
              />
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
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </CommonModal>
    </>
  );
};

export default CreateNoteModal;
