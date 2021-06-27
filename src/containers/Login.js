import React, {useState} from 'react';
import { Auth } from "aws-amplify";
import Form from 'react-bootstrap/Form';
import { useAppContext } from '../libs/context-libs';
import { onError } from '../libs/error-libs';
import { useHistory } from "react-router-dom";
import  LoaderButton from "../components/Loader/LoadButton";
import './Login.css';

export default function Login() {
    const { setIsAuthenticated } = useAppContext();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();

    const validateForm = () => {
        return email.length > 0 && password.length > 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        try {
            await Auth.signIn(email, password);
            setIsAuthenticated(true);
            history.push("/");
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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