const { GraphQLScalarType } = require("graphql");

const checkDate = (val) => val instanceof Date ? val : null;

exports.resolvers = {
    Date: new GraphQLScalarType({
        name: "Date",
        serialize: checkDate,
    })
}