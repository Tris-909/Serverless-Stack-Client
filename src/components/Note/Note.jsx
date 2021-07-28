import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Image,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useDisclosure,
  Textarea,
  Input,
  Button,
} from "@chakra-ui/react";
import Draggable from "react-draggable";
import { API } from "aws-amplify";
import { CloseIcon, SettingsIcon } from "@chakra-ui/icons";
import { BsPencil } from "react-icons/bs";
import config from "config";
import { uploadToS3 } from "libs/awsLib";
import { onError } from "libs/error-libs";
import "./Note.scss";

const Note = ({ note, deleteNote, fetchLists }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef();
  const finalRef = useRef();

  const [position, setPosition] = useState({ x: note.x, y: note.y });
  const [header, setHeader] = useState(note.header);
  const [content, setContent] = useState(note.content);
  const [previewImage, setPreviewImage] = useState(null);
  const [deleteImage, setDeleteImage] = useState(false);
  const file = useRef(null);

  const trackPosition = (data) => {
    setPosition({ x: data.x, y: data.y });
    savePositionToDatabases();
  };

  const savePositionToDatabases = async () => {
    await API.put("notes", `/notes/drag/${note.noteId}`, {
      body: {
        x: position.x,
        y: position.y,
      },
    });
  };

  const handleFileChange = (event) => {
    file.current = event.target.files[0];
    setPreviewImage(URL.createObjectURL(event.target.files[0]));
    setDeleteImage(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let attachment;

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    try {
      if (file.current) {
        attachment = await uploadToS3(file.current);
      }

      await API.put("notes", `/notes/${note.noteId}`, {
        body: {
          header,
          content,
          attachment: attachment || note.attachment,
        },
      });
      onClose();
      fetchLists();
    } catch (e) {
      onError(e);
    }
  };

  const clearFileHandler = () => {
    setPreviewImage(null);
    file.current = {};
    setDeleteImage(true);
  };

  const onEditHandler = () => {
    setPreviewImage(null);
    file.current = {};
    setDeleteImage(false);
    onOpen();
  };

  return (
    <>
      <Draggable
        onDrag={(e, data) => trackPosition(data)}
        defaultPosition={{ x: note.x, y: note.y }}
      >
        <Box
          width="fit-content"
          minWidth="250px"
          minHeight={note.attachment ? "250px" : "auto"}
          borderRadius="7px"
          background="white"
          className="drag"
        >
          <HStack my={2} paddingLeft={2} width="250px">
            <Box fontWeight="bold" width="100%">
              {note.header}
            </Box>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<SettingsIcon />}
                variant="none"
              />
              <MenuList>
                <MenuItem
                  icon={<BsPencil viewBox="0 0 15 15" />}
                  onClick={() => onEditHandler()}
                >
                  Edit Note
                </MenuItem>
                <MenuItem
                  icon={<CloseIcon />}
                  onClick={() => deleteNote(note.noteId)}
                >
                  Delete Note
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>

          <Box
            width="260px"
            height={note.attachment ? "260px" : "150px"}
            position="relative"
          >
            {note.attachment ? (
              <>
                <Image
                  position="absolute"
                  objectFit="cover"
                  width="100%"
                  height="100%"
                  src={`https://notes-app-upload-tritran.s3.ap-southeast-2.amazonaws.com/private/${note.userId}/${note.attachment}`}
                  alt={note.id}
                />
                <Box
                  width="100%"
                  height="100%"
                  zIndex={2}
                  position="absolute"
                  backgroundColor="transparent"
                ></Box>
              </>
            ) : (
              <Box height="260px" p={2}>
                {note.content}
              </Box>
            )}
          </Box>
        </Box>
      </Draggable>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
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
        </ModalContent>
      </Modal>
    </>
  );
};

export default Note;
