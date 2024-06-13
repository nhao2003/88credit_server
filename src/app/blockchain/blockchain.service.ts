import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateLoanContractDTO, IBlockchainService } from './dto';
import { readFileSync } from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const HDWalletProvider = require('@truffle/hdwallet-provider');
import { Web3 } from 'web3';
import { ppid } from 'process';
import { ConfigService } from '@nestjs/config';
const mnemonic =
  'mosquito bind toe kit reward math embrace rally sing acoustic rally matrix';
@Injectable()
export class BlockchainService implements IBlockchainService {
  private contract: any;
  private accountAddress: string = '0x418EDE79a5E0045185794a4cC3300e356318a704';
  private logger: Logger = new Logger('EkycBlockchainService');

  constructor(private readonly configService: ConfigService) {
    console.log(
      this.configService.get('ETHEREUM_PROVIDER') || 'http://localhost:7545',
    );
    const provider = new HDWalletProvider({
      mnemonic,
      // providerOrUrl: 'http://localhost:7545',
      providerOrUrl:
        this.configService.get('ETHEREUM_PROVIDER') || 'http://localhost:7545',
    });
    const web3 = new Web3(provider as any);
    const contractAbi = JSON.parse(
      readFileSync('blockchain/build/LoanContractManager.json', 'utf8'),
    ).abi;
    // Print all accounts
    web3.eth.getAccounts().then((accounts) => {
      console.log(accounts);
    });
    this.contract = new web3.eth.Contract(
      contractAbi,
      '0x3e51557F2c193ABaFA40a0756DD56Eb0A1163c48',
    );
  }
  async getLoanContractById(loanId: string): Promise<any> {
    try {
      return await this.contract.methods.getLoanContractById(loanId).call({
        from: this.accountAddress,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async getAllLoanContracts(): Promise<any> {
    try {
      return await this.contract.methods.getAllLoanContracts().call({
        from: this.accountAddress,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async addLoanContract(
    createLoanContractDTO: CreateLoanContractDTO,
  ): Promise<any> {
    console.log(createLoanContractDTO);
    try {
      return await this.contract.methods
        .addLoanContract({
          ...createLoanContractDTO,
          status: 0,
        })
        .send({
          from: this.accountAddress,
        });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async approveLoanContract(loanId: string): Promise<any> {
    try {
      return await this.contract.methods.approveLoanContract(loanId).call({
        from: this.accountAddress,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async rejectLoanContract(loanId: string): Promise<any> {
    try {
      return await this.contract.methods.rejectLoanContract(loanId).call({
        from: this.accountAddress,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async activateLoanContract(loanId: string): Promise<any> {
    try {
      return await this.contract.methods.activateLoanContract(loanId).call({
        from: this.accountAddress,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
