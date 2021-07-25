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
  HStack,
  Image,
} from "@chakra-ui/react";
import { SmallAddIcon } from "@chakra-ui/icons";
import { useHistory } from "react-router";
import { onError } from "../libs/error-libs";
import { uploadToS3 } from "../libs/awsLib";
import config from "../config";
import { API } from "aws-amplify";
import "./Home.css";

const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();
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
      onClose();
    } catch (error) {
      onError(e);
    }
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
      <HStack flexWrap="wrap" margin={3}>
        {data.map((singleTodo) => {
          return (
            <Box
              key={singleTodo.noteId}
              width="fit-content"
              background="white"
              p={3}
            >
              {singleTodo.content}
              {singleTodo.attachment && (
                <Image
                  boxSize="100px"
                  objectFit="cover"
                  src={`https://notes-app-upload-tritran.s3.ap-southeast-2.amazonaws.com/private/${singleTodo.userId}/${singleTodo.attachment}`}
                  alt={singleTodo.id}
                />
              )}
            </Box>
          );
        })}
      </HStack>
    </div>
  );
};

export default Home;
