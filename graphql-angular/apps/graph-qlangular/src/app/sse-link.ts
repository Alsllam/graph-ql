import { ApolloLink, Operation, Observable, FetchResult, NextLink } from "@apollo/client/core";
import { createClient, ClientOptions, Client } from 'graphql-sse';
import { print, GraphQLError } from 'graphql';

export class SSELink extends ApolloLink {
  private client: Client;

  constructor(options: ClientOptions) {
    super();
    this.client = createClient(options);
  }

  public override request(operation: Operation, forward?: NextLink): Observable<FetchResult> {
    return new Observable((sink) => {
      return this.client.subscribe<FetchResult>(
        { ...operation, query: print(operation.query) },
        {
          next: sink.next.bind(sink),
          complete: sink.complete.bind(sink),
          error: sink.error.bind(sink),
        },
      );
    });
  }
}
