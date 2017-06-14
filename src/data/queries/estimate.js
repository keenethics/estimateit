import {
  EstimateOutputType,
} from '../types';
import Estimate from '../../data/models/estimate';
import {
  GraphQLList as ListType,
  GraphQLString as StringType,
  GraphQLObjectType as ObjectType,
} from 'graphql';

const estimate = {
  type: EstimateOutputType,
  async resolve({ request }) {
    // console.log('dalsdasdjalkdjalkdjsaldjl');
    // console.log(request);
    // console.log();
    let estiamte;
    await Estimate.findOne({}, (err, res) => {
      // console.log('res');
      // console.log(res);
      estiamte = res;
    })

    return estiamte;
  },
};

export default estimate;
