import React, {useState} from 'react';
import { Auth } from "aws-amplify";
import Form from 'react-bootstrap/Form';
import { useAppContext } from '../libs/context-libs';
import { onError } from '../libs/error-libs';
import { useFormFields } from '../libs/formValues-libs';
import  LoaderButton from "../components/Loader/LoadButton";
import './Login.css';

export default function Login() {
    const { setIsAuthenticated } = useAppContext();

    const [isLoading, setIsLoading] = useState(false);
    const [fields, setFieldValueChanges] = useFormFields({
      email: "",
      password: "",
    });

    const validateForm = () => {
        return fields.email.length > 0 && fields.password.length > 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        try {
            await Auth.signIn(fields.email, fields.password);
            setIsAuthenticated(true);
        } catch (error) {
            onError(error);
        }
    }

    return(
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={fields.email}
            onChange={setFieldValueChanges}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={fields.password}
            onChange={setFieldValueChanges}
          />
        </Form.Group>
        <LoaderButton
        block
        size="lg"
        type="submit"
        isLoading={isLoading}
        disabled={!validateForm()}>
            Login
        </LoaderButton>
      </Form>
    </div>
    );
}