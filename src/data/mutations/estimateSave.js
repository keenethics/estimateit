import Estimate from '../models';
import { UserError } from '../errors';
import { EstimateCreateType } from '../types';
import EstimateInputType from '../types/estimateInput';


const estimateSave = {
  type: EstimateCreateType,
  args: {
    input: {
      type: EstimateInputType,
    },
  },
  async resolve({ request: { user } }, { input }) {
    if (!user) {
      throw new UserError({});
    }

    let res;
    const { _id } = input;

    try {
      res = await Estimate.update({ _id }, { $set: { ...input } });
    } catch (error) {
      return console.error(error);
    }

    return { url: 'ok ' };
  },
};

export default estimateSave;
