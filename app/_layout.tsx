import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Stack } from "expo-router";
import { ApolloClient, InMemoryCache, ApolloProvider, ApolloLink, HttpLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { SafeAreaView } from "react-native-safe-area-context";

  
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});


const client = new ApolloClient({
  link: ApolloLink.from([
    errorLink,
    new HttpLink({ uri: "http://localhost:4000/" })
  ]),
  cache: new InMemoryCache(),
});

const Layout = () => {
  return (
    <ApolloProvider client={client}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: "#6200ee",
              },
              headerTitleStyle: {
                color: "#fff",
              },
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                title: "Home",
                headerTitleStyle: {
                  color: "#fff",
                },
              }}
            />
          </Stack>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Footer Navigation Here</Text>
        </View>
      </SafeAreaView>
    </ApolloProvider>
  );
};

export default Layout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    boxSizing: "border-box",
    margin: 0,
    padding: 0
  },
  content: {
    flex: 1,
    padding: 10,
  },
  footer: {
    backgroundColor: "#6200ee",
    padding: 10,
    alignItems: "center",
  },
  footerText: {
    color: "#fff",
  },
});
