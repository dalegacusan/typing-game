import React, { useState } from "react";
import { useAuth } from "../ contexts/authUserContext";
import { Box, Center, Loader, Paper, Text, Title } from "@mantine/core";
import GoogleLoginButton from "../components/social-login-buttons/google-login-btn";
import Link from "next/link";

const SignIn = () => {
  const { loading, signInWithGoogle, authUser } = useAuth();
  const [isSignInError, setIsSignInError] = useState<boolean>(false);

  const signIn = async () => {
    const { user, error } = await signInWithGoogle();

    // TODO - Not working (app does not reach here)
    if (error) {
      setIsSignInError(true);

      return;
    }
  };

  return (
    <Box>
      <Title
        align="center"
        sx={(theme) => ({
          fontWeight: 900,
        })}
      >
        Welcome back!
      </Title>

      <Text color="dimmed" size="sm" align="center" mt={5}>
        Sign in to join the leaderboards.
      </Text>

      <Center>
        <Paper
          withBorder
          shadow="md"
          p={30}
          radius="md"
          mt="xl"
          style={{ width: "50%" }}
        >
          {loading && (
            <Center>
              <Loader size="sm" />
            </Center>
          )}

          {!loading && !authUser && (
            <>
              <GoogleLoginButton
                radius="xs"
                variant="white"
                onClick={signIn}
                fullWidth
              >
                Sign in with Google
              </GoogleLoginButton>
              <Box mt="lg">
                <Link href="/" passHref>
                  <Text component="a" variant="link" size="sm" color="gray">
                    or play as a guest
                  </Text>
                </Link>
              </Box>
            </>
          )}

          {!loading && authUser && (
            <Text color="dimmed" size="sm" align="center" mt={5}>
              You are already signed in.
            </Text>
          )}
        </Paper>
      </Center>

      {isSignInError && <p>Failed to sign in.</p>}
    </Box>
  );
};

export default SignIn;