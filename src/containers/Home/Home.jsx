import React, { useState, useEffect } from "react";
import { useDisclosure, Box } from "@chakra-ui/react";
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
              fetchLists={fetchLists}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default Home;
