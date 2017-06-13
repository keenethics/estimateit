import {
  GraphQLObjectType as ObjectType,
} from 'graphql';

import Estimate from '../models';
import EstimateType from '../types/estimate';
import EstimateCreateType from '../types/estimateCreate';
console.log(Estimate);

const Mutation = new ObjectType({
  name: 'EstimateMutation',
  description: 'Estimate',
  fields: () => ({
    estimateCreate: {
      type: EstimateCreateType,
      args: {
        input : {
          type: EstimateType
        },
      },
      resolve(source, {input: { header, main } }) {
        console.log(header);
        console.log(main);

        Estimate.save(function (err, estimate) {
          if (err) return console.error(err);
          console.log(Estimate);
        });

        return { url: 'asas' };
      },
    },
  }),
});

export default Mutation;
