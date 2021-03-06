import React, { useEffect, useState } from "react";
import { Box, Group, Loader, Tabs, Text, Title } from "@mantine/core";
import { useAuth } from "../ contexts/authUserContext";
import { Game } from "../interfaces/game.interface";
import { QUERY_GAMES_USER } from "../utils/http";
import { QueryOrderDirection } from "../utils/api/enums/query-order-direction.enum";
import { AlertCircle, History, Settings } from "tabler-icons-react";
import { showNotification } from "@mantine/notifications";
import { ApiResultStatus } from "../utils/api/enums/api-result-status.enum";
import { defaultGamesToDisplayCount } from "../config/app";
import PageNotFound from "./404";
import AccountGameHistory from "../components/account-page/account-game-history";
import AccountSettings from "../components/account-page/account-settings";
import Head from "next/head";

const UserAccount = () => {
  const { authUser, loading } = useAuth();
  const [games, setGames] = useState<Game[]>();
  const [gameLastKey, setGameLastKey] = useState<number | undefined>();
  const [isLoadingNextGames, setIsLoadingNextGames] = useState<boolean>(false);

  useEffect(() => {
    if (!loading && authUser) {
      QUERY_GAMES_USER(
        authUser.idToken as string,
        defaultGamesToDisplayCount,
        { direction: QueryOrderDirection.DESC, fieldPath: "dateCreated" },
        authUser.uid
      )
        .then((data) => {
          if (data.resultInfo.resultStatus === ApiResultStatus.FAILURE) {
            showNotification({
              id: "fail-query-games",
              autoClose: 5000,
              title: "Something went wrong.",
              message: `Failed to retrieve records. Ref: ${data.resultInfo.resultCode}`,
              color: "red",
              icon: <AlertCircle size={16} />,
            });

            setGames([]);
          } else {
            const { games, lastKey } = data;

            //@ts-ignore
            setGames(games);
            setGameLastKey(lastKey);
          }
        })
        .catch(() => {
          showNotification({
            id: "fail-query-games",
            autoClose: 5000,
            title: "Something went wrong.",
            message: "Failed to retrieve records.",
            color: "red",
            icon: <AlertCircle size={16} />,
          });
        });
    }
  }, [loading]);

  return (
    <>
      <Head>
        <title>Typechron - My Account</title>
      </Head>
      <Box mb={70}>
        {loading && !authUser && <Loader size="sm" />}

        {!loading && !authUser && (
          <>
            <PageNotFound />
          </>
        )}

        {!loading && authUser && (
          <Box>
            <Title order={2}>My Account</Title>
            <Group grow>
              <Text size="sm" color="dimmed" mt={4}>
                Hello, {authUser.username}
              </Text>
              {games && games.length !== 0 && (
                <Text size="sm" align="right" color="dimmed">
                  Showing {games.length} record{games.length !== 1 && "s"}
                </Text>
              )}
            </Group>

            <Tabs color="blue" mt={30}>
              <Tabs.Tab label="History" icon={<History size={16} />}>
                <AccountGameHistory
                  games={games}
                  setGames={setGames}
                  gameLastKey={gameLastKey}
                  setGameLastKey={setGameLastKey}
                  isLoadingNextGames={isLoadingNextGames}
                  setIsLoadingNextGames={setIsLoadingNextGames}
                />
              </Tabs.Tab>
              <Tabs.Tab label="Settings" icon={<Settings size={16} />}>
                <AccountSettings />
              </Tabs.Tab>
            </Tabs>
          </Box>
        )}
      </Box>
    </>
  );
};

export default UserAccount;
