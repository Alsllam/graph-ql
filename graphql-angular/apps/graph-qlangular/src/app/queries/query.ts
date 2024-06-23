import { gql } from "apollo-angular";

export  const GET_DATA = gql`
query GetFeeds{
  feed{
    id,
    description,
  }
}
`