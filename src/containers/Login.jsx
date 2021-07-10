import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useAppContext } from "../libs/context-libs";
import useBreakPoints from "../libs/useMediaQueries";
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
  const { isSM } = useBreakPoints();

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
      <GridItem colStart={isSM ? 2 : 4} colEnd={isSM ? 12 : 10}>
        <Box borderWidth="1px" borderRadius="lg" bg="#f2f2f7" p="10">
          <Heading
            as="h3"
            fontSize={isSM ? "6rem" : "3rem"}
            className="FormHeader"
            textAlign="center"
            marginBottom={14}
          >
            {" "}
            Your Words{" "}
          </Heading>
          <form onSubmit={handleSubmit}>
            <FormControl isInvalid={error} id="email">
              <FormLabel fontSize={isSM ? "32px" : "16px"}>Email</FormLabel>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size={isSM ? "lg" : "md"}
                className="Input"
              />
              <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>
            <FormControl id="password" marginTop={4}>
              <FormLabel fontSize={isSM ? "32px" : "16px"}>Password</FormLabel>
              <Input
                type="password"
                value={password}
                size={isSM ? "lg" : "md"}
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
                marginTop={isSM ? 12 : 6}
                marginBottom={isSM ? 12 : 6}
                p={isSM ? 8 : 0}
                fontSize={isSM ? "32px" : "16px"}
                className="SubmitButton"
              >
                Login
              </Button>
              <Text
                justifySelf="flex-end"
                className="SignUp"
                fontSize={isSM ? "32px" : "16px"}
              >
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
