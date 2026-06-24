import dotenv from "dotenv";
dotenv.config();

import 'reflect-metadata';
import cors from "cors";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { buildSchema } from "type-graphql";
import { AuthResolver } from "./resolvers/auth.resolver";
import { UserResolver } from "./resolvers/user.resolver";
import { buildContext } from "./graphql/context";
import { CategoryResolver } from "./resolvers/category.resolver";
import { TransactionResolver } from "./resolvers/transaction.resolver";

async function bootstrap() {
    const app = express()

    app.use(cors({
    origin: process.env.VITE_API_URL || 'http://localhost:5173',
    credentials: true,
    })
)

    const schema = await buildSchema({
        resolvers: [AuthResolver, UserResolver, CategoryResolver, TransactionResolver],
        // resolvers: [AuthResolver, UserResolver, CategoryResolver, TransactionResolver],
        validate: false,
        emitSchemaFile: './schema.graphql',
    })
    const server = new ApolloServer({
        schema,
    })
    
    await server.start();

    app.use('/graphql',
         express.json(),
         expressMiddleware(server, {context: buildContext})
        );

        app.listen({
            port: 4000,
         }, () => {
            console.log('Server is running on http://localhost:4000/graphql');
        })


        }

bootstrap();