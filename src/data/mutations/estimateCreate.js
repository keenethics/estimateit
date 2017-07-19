import Estimate from '../models';
import { UserError } from '../errors';
import { EstimateCreateType } from '../types';


const estimateCreate = {
  type: EstimateCreateType,
  async resolve({ request: { user } }) {
    if (!user) {
      throw new UserError({});
    }

    let url;
    const { _id: userId } = user;

    try {
      const newEstimate = new Estimate({ owner: userId });
      const { _id } = await newEstimate.save();

      url = `estimate/${_id}`;
    } catch (error) {
      return console.error(error);
    }

    return { url };
  },
};

export default estimateCreate;
