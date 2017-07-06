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

      async resolve({ request: { headers, user } }, { input: { header, main } }) {
        let url;
        const newEstimate = new Estimate({ owner: user._id, main, header });
        await newEstimate.save((err, estimate) => {
          if (err) return null;
          const { _id } = estimate;
          url = `${headers.referer}${_id}`;
        });
        return { url };
      },
    },
  }),
});

export default Mutation;
