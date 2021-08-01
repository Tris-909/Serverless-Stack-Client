import React, { useState, useEffect, useRef } from "react";
import {
  Icon,
  Button,
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
  Box,
  Input,
} from "@chakra-ui/react";
import { SmallAddIcon } from "@chakra-ui/icons";
import { onError } from "libs/error-libs";
import { uploadToS3, deleteFromS3 } from "libs/awsLib";
import config from "config";
import { API } from "aws-amplify";
import Note from "components/Note/Note";
import CreateNoteModal from "components/NoteModal/CreateNoteModal";

const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    const result = await API.get("notes", "/notes");
    setData(result);
  };

  const deleteNote = async (noteId, objectKey) => {
    await API.del("notes", `/notes/${noteId}`);
    await deleteFromS3(objectKey);
    fetchLists();
  };

  return (
    <Box className="home">
      <CreateNoteModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        fetchLists={fetchLists}
      />
      <Box position="relative">
        {data.map((singleTodo) => {
          return (
            <Note
              key={singleTodo.noteId}
              note={singleTodo}
              deleteNote={deleteNote}
              fetchLists={fetchLists}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default Home;
