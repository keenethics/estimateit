import Estimate from '../models';
import User from '../../models/user';
import { UserError } from '../errors';
import { EstimateAddNewContributor } from '../types';
import {
  GraphQLBoolean as BoolType,
} from 'graphql';

// import {
//   GraphQLObjectType as ObjectType,
//   GraphQLString as StringType,
// } from 'graphql';
//
// const typeExp = new ObjectType({
//   name: 'typeExp',
//   fields: {
//     _id: {
//       type: StringType,
//     },
//   },
// });


const estimateAddNewContributor = {
  type: BoolType,
  args: {
    input: {
      type: EstimateAddNewContributor,
    },
  },
  async resolve({ request: { user } }, { input: { estimateId, username, userId, userEmail } }) {
    if (!user) {
      throw new UserError({});
    }
    // user already added???
    const { users = [] } = await Estimate.find({ _id: estimateId });

    const res = await Estimate.update(
      { _id: estimateId },
      { $push: { users: { userId, username, userEmail } } },
    );

    return true;
  },
};

export default estimateAddNewContributor;
