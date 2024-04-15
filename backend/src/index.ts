import "reflect-metadata";
import { dataSource } from "./datasource";
import { buildSchema } from "type-graphql";
import { CountryResolver } from "./resolvers/Countries";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

async function start() {
  const port = 5000;

  const schema = await buildSchema({
    resolvers: [CountryResolver],
  });

  const server = new ApolloServer({
    schema,
  });

  await dataSource.initialize();

  await startStandaloneServer(server, {
    listen: {
      port,
    },
  });

  console.log(`Server started 🚀, listening on port ${port}`);
}

start();
