import React, { useState } from "react";
import { Box, Image, HStack, Icon } from "@chakra-ui/react";
import Draggable from "react-draggable";
import { API } from "aws-amplify";
import { CloseIcon } from "@chakra-ui/icons";
import "./Note.scss";

const Note = ({ note, deleteNote }) => {
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
        width="fit-content"
        minWidth="250px"
        minHeight={note.attachment ? "250px" : "auto"}
        borderRadius="7px"
        background="white"
        className="drag"
      >
        <HStack my={2} px={2} width="250px">
          <Box fontWeight="bold" width="90%">
            {note.header}
          </Box>
          <Icon
            as={CloseIcon}
            zIndex={3}
            onClick={() => deleteNote(note.noteId)}
            cursor="pointer"
          />
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
  );
};

export default Note;
