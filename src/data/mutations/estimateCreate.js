import { Estimate } from '../models';
import { UserError } from '../errors';
import { EstimateCreateType } from '../types';


const estimateCreate = {
  type: EstimateCreateType,
  async resolve({ request: { user } }) {
    if (!user) {
      throw new UserError({});
    }

    let url;
    const { _id } = user;

    try {
      const newEstimate = new Estimate({ owner: _id.toString() });

      const { _id: estimateId } = await newEstimate.save();

      url = `estimate/${estimateId}`;
    } catch (error) {
      return console.error(error);
    }

    return { url };
  },
};

export default estimateCreate;
