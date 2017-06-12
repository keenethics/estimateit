import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import EstimateType from '../types/estimate';
import Estimate from '../models';


const Mutation = new ObjectType({
  name: 'EstimateMutation',
  description: 'Estimate user',
  fields: () => ({
    createUser: {
      type: UserType,
      args: {
        main: { type: ObjectType },
        header: { type: ObjectType },
      },
      resolve(source, { main, header }) {

        return User.create({ main, header });
      },
    },
  }),
});

export default Mutation;
