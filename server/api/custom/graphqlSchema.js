import {
 GraphQLSchema,
 GraphQLObjectType,
 GraphQLInt,
 GraphQLString,
 GraphQLList,
 GraphQLNonNull,
 GraphQLID,
 GraphQLBoolean,
 GraphQLFloat
} from 'graphql';
import axios from 'axios';

const UserFollowingUrl = new GraphQLObjectType({
  name: "Following_Url",
  description: "Obtains information about the users followed by subject of interest",
  fields: () => ({
    "login": { type: GraphQLString },
    "id": {type: GraphQLInt},
    "avatar_url": { type: GraphQLString },
    "gravatar_id": { type: GraphQLString },
    "url": { type: GraphQLString },
    "html_url": { type: GraphQLString },
    "followers_url":{ type: GraphQLString },
    "following_url": { type: GraphQLString },
    "gists_url": { type: GraphQLString },
    "starred_url": { type: GraphQLString },
    "subscriptions_url": { type: GraphQLString },
    "organizations_url": { type: GraphQLString },
    "repos_url": { type: GraphQLString },
    "events_url": { type: GraphQLString },
    "received_events_url": { type: GraphQLString },
    "type": { type: GraphQLString },
    "site_admin": { type: GraphQLBoolean }
  })
});

const UserInfoType = new GraphQLObjectType({
 name: "UserInfo",
 description: "Basic information on a GitHub user",
 fields: () => ({
   "login": { type: GraphQLString },
   "id": { type: GraphQLInt },
   "avatar_url": { type: GraphQLString },
   "following_url":  {
     type: GraphQLString,
     resolve: (obj) => {
       const brackIndex = obj.following_url.indexOf("{");
       return obj.following_url.slice(0, brackIndex);
     }
    }
   ,
   "followers": {
     type: new GraphQLList(UserFollowingUrl),
     description: "Returns all followers' details for the user",
     resolve: (obj) => {
      const brackIndex = obj.following_url.indexOf("{");
      const url = obj.following_url.slice(0, brackIndex);
      return axios.get(url)
                  .then(function(response) {
                  return response.data;
                  });
     }
   },
   "site_admin": { type: GraphQLBoolean }
 })
});


const query = new GraphQLObjectType({
  name: "Query",
  description: "First GraphQL Server Config — Yay!",
  fields: () => ({
    gitHubUser: {
      type: UserInfoType,
      description: "GitHub user API data with enhanced and additional data",
      args: {
        username: {
          type: new GraphQLNonNull(GraphQLString),
          description: "The GitHub user login you want information on",
        },
      },
      resolve: (_,{username}) => {
        const url = `https://api.github.com/users/${username}`;
        return axios.get(url)
                    .then(function(response) {
                      return response.data;
                    });
      }
    },
  })
});

const schema = new GraphQLSchema({
 query
});
export default schema;
