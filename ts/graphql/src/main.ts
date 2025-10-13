import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { gql } from 'graphql-tag';
import { readFileSync } from 'fs';
import path from 'path';

const typeDefs = gql(readFileSync(path.join(__dirname, 'schema.graphql'), { encoding: 'utf-8' }));

async function startApolloServer(): Promise<void> {
  const server = new ApolloServer({ typeDefs });
  const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
  console.log(`🚀  Server ready at: ${url}`);
}

startApolloServer().catch((error) => {
  console.error('Error starting the server:', error);
});
