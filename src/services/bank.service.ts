import { Service } from 'typedi';
import CommonServices from './common.service';
import Bank from '~/models/databases/Bank';

@Service()
class BankService extends CommonServices {
  constructor() {
    super(Bank);
  }
}

export default BankService;
