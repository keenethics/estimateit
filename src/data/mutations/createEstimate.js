import {
  GraphQLObjectType as ObjectType,
} from 'graphql';

import Estimate from '../models';
import EstimateType from '../types/estimate';
import EstimateCreateType from '../types/estimateCreate';

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

        const newEstimate = new Estimate({
          main: main,
          header: header,
        });

        newEstimate.save(function (err, estimate) {
          if (err) return console.error(err);
          console.log(estimate);
        });

        return { url: 'asas' };
      },
    },
  }),
});

export default Mutation;
