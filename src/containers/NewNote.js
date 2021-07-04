import React, { useRef, useState } from 'react';
import Form from "react-bootstrap/Form";
import { useHistory } from 'react-router';
import LoaderButton from '../components/Loader/LoadButton';
import { onError } from '../libs/error-libs';
import { uploadToS3 } from '../libs/awsLib';
import config from '../config';
import { API } from "aws-amplify";
import './NewNote.css';

const NewNote = () => {
    const file = useRef(null);
    const history = useHistory();
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        return content.length > 0;
    }

    const handleFileChange = (e) => {
        file.current = e.target.file[0];
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (file.current && file.current.size > config.maxAttachmentSize) {
            alert(`Please pick up a file smaller than ${config.maxAttachmentSize / 1000000} MB`);
            return;
        }
        setIsLoading(true);

        try {
          const attachment = file.current ? await uploadToS3(file.current) : null;
          await createNote({ content, attachment });
          history.push('/');
        } catch(error) {
          onError(e);
          setIsLoading(false);
        }
    }

    const createNote = (note) => {
      return API.post("notes", "/notes", {
        body: note
      });
    }

    return(
        <div className="NewNote">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="content">
            <Form.Control
              value={content}
              as="textarea"
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="file">
            <Form.Label>Attachment</Form.Label>
            <Form.Control onChange={handleFileChange} type="file" />
          </Form.Group>
          <LoaderButton
            block
            type="submit"
            size="lg"
            variant="primary"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Create
          </LoaderButton>
        </Form>
      </div>
    );
}

export default NewNote;