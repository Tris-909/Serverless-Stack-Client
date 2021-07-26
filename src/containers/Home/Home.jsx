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
} from "@chakra-ui/react";
import { SmallAddIcon } from "@chakra-ui/icons";
import { onError } from "libs/error-libs";
import { uploadToS3 } from "libs/awsLib";
import config from "config";
import { API } from "aws-amplify";
import Note from "components/Note/Note";

const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef();
  const finalRef = useRef();

  const file = useRef(null);
  const [content, setContent] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    const result = await API.get("notes", "/notes");
    setData(result);
  };

  const handleFileChange = (e) => {
    file.current = e.target.files[0];
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
      await createNote({ content, attachment });
      fetchLists();
      onClose();
    } catch (error) {
      onError(e);
    }
  };

  const deleteNote = async (noteId) => {
    await API.del("notes", `/notes/${noteId}`);
    fetchLists();
  };

  return (
    <div className="home">
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a new note</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form>
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
                <input onChange={handleFileChange} type="file" id="file" />
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={(e) => handleSubmit(e)}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Button position="absolute" right="5" bottom="5" onClick={onOpen}>
        <Icon as={SmallAddIcon} boxSize={8} />
      </Button>
      <Box position="relative">
        {data.map((singleTodo) => {
          return (
            <Note
              key={singleTodo.noteId}
              note={singleTodo}
              deleteNote={deleteNote}
            />
          );
        })}
      </Box>
    </div>
  );
};

export default Home;
