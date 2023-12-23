import { Service } from 'typedi';
import HttpStatus from '~/constants/httpStatus';
import { APP_MESSAGES } from '~/constants/message';
import ServerCodes from '~/constants/server_codes';
import { AppError } from '~/models/Error';
import StringUtils from '~/utils/StringUtils';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';

@Service()
class CommonValidation {
  private stringUtils: StringUtils;
  constructor() {
    this.stringUtils = new StringUtils();
  }
  public validateId = wrapRequestHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!this.stringUtils.isUUID(id)) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'fail',
        code: ServerCodes.CommomCode.InvalidUUID,
        message: APP_MESSAGES.InValidUUID,
      });
    } else {
      next();
    }
  });
}

export default CommonValidation;
