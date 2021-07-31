import React, { useState, useRef } from "react";
import {
  Box,
  Image,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import EditNoteModal from "../NoteModal/EditNoteModal";
import Draggable from "react-draggable";
import { API } from "aws-amplify";
import { CloseIcon, SettingsIcon, Search2Icon } from "@chakra-ui/icons";
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
  const [onHide, setOnHide] = useState(true);

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
      if (file.current.type.split("/")[0] === "image") {
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
                  onMouseEnter={() => setOnHide(false)}
                  onMouseLeave={() => setOnHide(true)}
                >
                  <Box
                    position="relative"
                    left="40%"
                    top="40%"
                    width="48px"
                    height="48px"
                    bg="#2e2f30"
                    borderRadius="full"
                    transition="visibility 0s, opacity 0.5s"
                    visibility={onHide ? "hidden" : "visible"}
                    opacity={onHide ? 0 : 0.7}
                    cursor="pointer"
                  >
                    <Search2Icon
                      color="white"
                      marginInlineEnd="0px"
                      position="absolute"
                      top="34%"
                      left="33%"
                    />
                  </Box>
                </Box>
              </>
            ) : (
              <Box height="260px" p={2}>
                {note.content}
              </Box>
            )}
          </Box>
        </Box>
      </Draggable>
      <EditNoteModal
        header={header}
        setHeader={setHeader}
        initialRef={initialRef}
        content={content}
        setContent={setContent}
        deleteImage={deleteImage}
        previewImage={previewImage}
        note={note}
        clearFileHandler={clearFileHandler}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
};

export default Note;
