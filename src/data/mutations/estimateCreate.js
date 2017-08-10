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
    const { _id, name, email } = user;

    try {
      const newEstimate = new Estimate({ owner: {
        _id: _id.toString(),
        name,
        email,
      } });

      const { _id: estiamteId } = await newEstimate.save();

      url = `estimate/${estiamteId}`;
    } catch (error) {
      return console.error(error);
    }

    return { url };
  },
};

export default estimateCreate;
