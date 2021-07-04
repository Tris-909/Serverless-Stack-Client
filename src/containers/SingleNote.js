import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../libs/error-libs";
import config from '../config';
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/Loader/LoadButton";
import { uploadToS3 } from "../libs/awsLib";
import './SingleNote.css';

export default function SingleNote() {
  const file = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [note, setNote] = useState(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    function loadNote() {
      return API.get("notes", `/notes/${id}`);
    }

    async function onLoad() {
      try {
        const note = await loadNote();
        const { content, attachment } = note;

        if (attachment) {
          note.attachmentURL = await Storage.vault.get(attachment);
        }

        setContent(content);
        setNote(note);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);
  
  function saveNote(note) {
    return API.put("notes", `/notes/${id}`, {
      body: note
    });
  }

  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }
  
  function handleFileChange(event) {
    file.current = event.target.files[0];
  }
  
  async function handleSubmit(event) {
    let attachment;
  
    event.preventDefault();
  
    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }
  
    setIsLoading(true);
  
    try {
      if (file.current) {
        attachment = await uploadToS3(file.current);
      }
  
      await saveNote({
        content,
        attachment: attachment || note.attachment
      });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  
  function deleteNote() {
    return API.del("notes", `/notes/${id}`);
  }
  
  async function handleDelete(event) {
    event.preventDefault();
    setIsDeleting(true);
  
    try {
      await deleteNote();
      history.push("/");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }

  return (
    <div className="Notes">
    {note && (
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="content">
          <Form.Control
            as="textarea"
            value={note.Item.content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="file">
          <Form.Label>Attachment</Form.Label>
          {note.attachment && (
            <p>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={note.attachmentURL}
              >
                {formatFilename(note.Item.attachment)}
              </a>
            </p>
          )}
          <Form.Control onChange={handleFileChange} type="file" />
        </Form.Group>
        <LoaderButton
          block
          size="lg"
          type="submit"
          isLoading={isLoading}
        >
          Save
        </LoaderButton>
        <LoaderButton
          block
          size="lg"
          variant="danger"
          onClick={handleDelete}
          isLoading={isDeleting}
        >
          Delete
        </LoaderButton>
      </Form>
    )}
  </div>
  );
}