import { Service } from 'typedi';
import StringUtils from '~/utils/StringUtils';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';

@Service()
class CommonValidation {
  public validateId = wrapRequestHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!new StringUtils().isUUID(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }
    next();
  });
}

export default CommonValidation;
