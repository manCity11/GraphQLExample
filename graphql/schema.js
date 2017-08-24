const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');
const axios = require('axios');

// API endpoint
const API_URL = 'http://localhost:3000/customers';

// Define types
//
const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    fields: () =>  ({
        id: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        age: {
            type: GraphQLInt
        }
    })
});


// Root query, base for all schema
//
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        customer: {
            type: CustomerType,
            args: {
                id: {
                    type: GraphQLString
                }
            },
            resolve(parentValue, args) {
                return axios
                    .get(API_URL + '/' + args.id)
                    .then(response => response.data);
            }
        },
        customers: {
            type: new GraphQLList(CustomerType),
            resolve(parentValue, args) {
                return axios
                    .get(API_URL)
                    .then(response => response.data);
            }
        }
    })
});

// Mutation
//
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addCustomer: {
            type: CustomerType,
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString) // is required
                },
                email: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                age: {
                    type: new GraphQLNonNull(GraphQLInt)
                }
            },
            resolve(parentValue, args) {
                return axios
                    .post(API_URL, {
                        name: args.name,
                        email: args.email,
                        age: args.age
                    })
                    .then(response => response.data);
            }
        },
        deleteCustomer: {
            type: CustomerType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve(parentValue, args) {
                return axios
                    .delete(API_URL + '/' + args.id)
                    .then(response => response.data);
            }
        },
        editCustomer: {
            type: CustomerType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                name: {
                    type: GraphQLString // is required
                },
                email: {
                    type: GraphQLString
                },
                age: {
                    type: GraphQLInt
                }
            },
            resolve(parentValue, args) {
                return axios
                    .patch(API_URL + '/' + args.id, args)
                    .then(response => response.data);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: mutation
});