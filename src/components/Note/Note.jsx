import React, { useState } from "react";
import { Box, Image } from "@chakra-ui/react";
import Draggable from "react-draggable";
import { API } from "aws-amplify";
import "./Note.css";

const Note = ({ note }) => {
  const [position, setPosition] = useState({ x: note.x, y: note.y });

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

  return (
    <Draggable
      onDrag={(e, data) => trackPosition(data)}
      defaultPosition={{ x: note.x, y: note.y }}
    >
      <Box
        key={note.noteId}
        width="fit-content"
        minWidth="250px"
        minHeight="250px"
        background="white"
        p={3}
        className="drag"
      >
        <Box marginBottom={2}>{note.content}</Box>
        <Box marginBottom={2}>
          {position.x} {position.y} {note.noteId}
        </Box>
        <Box width="250px" height="250px" position="relative">
          {note.attachment && (
            <>
              <Image
                position="absolute"
                objectFit="cover"
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
          )}
        </Box>
      </Box>
    </Draggable>
  );
};

export default Note;
