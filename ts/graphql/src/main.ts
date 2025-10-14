import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { gql } from 'graphql-tag';
import { createContext } from './context';
import { resolvers } from './resolvers';
import { readFileSync } from 'fs';
import path from 'path';

const typeDefs = gql(readFileSync(path.join(__dirname, 'schema.graphql'), { encoding: 'utf-8' }));

const start = async (): Promise<void> => {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, { context: createContext, listen: { port: 4000 } });
  console.log(`🚀  Server ready at: ${url}`);
};

start().catch((error) => {
  console.error('Error starting the server:', error);
});
