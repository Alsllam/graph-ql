import { gql } from "apollo-angular";

export const FEED_DETAILS = gql`
      fragment FeedDetails on Link {
        id,
        description,
        url,
      }
        # ...MoreFeedDetails
      fragment MoreFeedDetails on Link{
        comments { 
        linkId
        }
      }

`