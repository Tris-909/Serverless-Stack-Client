import React, { useEffect } from "react";
import { useDisclosure, Box } from "@chakra-ui/react";
import Note from "components/Note/Note";
import CreateNoteModal from "components/NoteModal/CreateNoteModal";
import { useSelector, useDispatch } from "react-redux";
import { fetchListNotes } from "redux/features/notes/note";

const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { list } = useSelector((state) => state.notes);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    dispatch(fetchListNotes());
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
        {list.data.map((singleTodo) => {
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
