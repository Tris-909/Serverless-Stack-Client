import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useAppContext } from "../libs/context-libs";
import {
  Grid,
  GridItem,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  FormErrorMessage,
} from "@chakra-ui/react";
import "./Login.css";

const Login = () => {
  const { setIsAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateForm = () => {
    return email.length > 0 && password.length > 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await Auth.signIn(email, password);
      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <Grid
      templateColumns="repeat(12, 1fr)"
      gap={6}
      alignContent="center"
      className="loginPage"
    >
      <GridItem colStart={8} colEnd={12}>
        <Box borderWidth="1px" borderRadius="lg" bg="#f2f2f7" p="10">
          <Heading
            as="h3"
            size="3xl"
            className="FormHeader"
            textAlign="center"
            marginBottom={14}
          >
            {" "}
            Your Words{" "}
          </Heading>
          <form onSubmit={handleSubmit}>
            <FormControl isInvalid={error} id="email">
              <FormLabel>Email</FormLabel>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="Input"
              />
              <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>
            <FormControl id="password" marginTop={4}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="Input"
              />
            </FormControl>
            <Grid templateColumns="repeat(2, 1fr)" alignItems="center">
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={!validateForm()}
                bg="#F56565"
                color="white"
                variant="solid"
                marginTop={6}
                marginBottom={6}
                className="SubmitButton"
              >
                Login
              </Button>
              <Text justifySelf="flex-end" className="SignUp">
                Sign Up Here
              </Text>
            </Grid>
          </form>
        </Box>
      </GridItem>
    </Grid>
  );
};

export default Login;
