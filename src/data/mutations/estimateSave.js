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

    const { _id } = input;

    try {
      const res = await Estimate.update({ _id: 'sss' }, { $set: { ...input } });
      console.log(res);
      return { url: 'ok ' };
    } catch (error) {
      return console.error(error);
    }
  },
};

export default estimateSave;
