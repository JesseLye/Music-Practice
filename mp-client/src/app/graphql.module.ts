import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';

// const uri = 'https://immense-caverns-15639.herokuapp.com/graphql'; // <-- add the URL of the GraphQL server here
const uri = 'http://localhost:8080/graphql';
export function createApollo(httpLink: HttpLink) {
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
      );
    if (networkError) { 
      console.log(`[Network error]:`);
      console.log(networkError);
    }
  });

  const link = httpLink.create({
    uri,
    withCredentials: true,
  });

  const httpLinkWithErrorHandling = ApolloLink.from([
    errorLink,
    link,
  ]);

  return {
    link: httpLinkWithErrorHandling,
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule { }
