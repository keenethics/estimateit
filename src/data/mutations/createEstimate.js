import {
  GraphQLObjectType as ObjectType,
} from 'graphql';
import Estimate from '../models';
import {
  EstimateInputType,
  EstimateCreateType,
} from '../types';

const Mutation = new ObjectType({
  name: 'EstimateMutation',
  description: 'Estimate',
  fields: () => ({
    estimateCreate: {
      type: EstimateCreateType,
      args: {
        input: {
          type: EstimateInputType,
        },
      },
      async resolve({ request: { headers, user } }, { input }) {
        let url;
        const newEstimate = new Estimate({ owner: user._id, ...input });
        await newEstimate.save((err, estimate) => {
          if (err) return null;
          const { _id } = estimate;
          url = `${_id}`;
        });
        console.log('\t  Hey', url);
        return { url };
      },
    },
  }),
});

export default Mutation;
