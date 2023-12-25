import { Service } from 'typedi';
import { Repository, DataSource } from 'typeorm';
import { InsertResult } from 'typeorm/browser';
import { Equal } from 'typeorm/browser';
import ContractTemplate, { IContractTemplate } from '~/models/databases/ContractTemplate';
import { BaseQuery } from '~/models/typing/base_query';
import appConfig from '~/constants/configs';
@Service()
class ContractTemplateService {
  private contractTemplateRepository: Repository<ContractTemplate>;

  constructor(dataSource: DataSource) {
    this.contractTemplateRepository = dataSource.getRepository(ContractTemplate);
  }

  public async getContractTemplateById(id: string): Promise<ContractTemplate | null> {
    return await this.contractTemplateRepository.createQueryBuilder().where({ id }).getOne();
  }

  public async getContractTemplates(query: BaseQuery): Promise<{
    number_of_pages: number;
    contract_templates: ContractTemplate[];
  }> {
    // const page = query.page || 1;
    // const take = appConfig.ResultPerPage;
    // const offset = (page - 1) * take;
    let { page } = query;
    if (page === 'all') {
      page = 'all';
    } else {
      page = Number(page) > 0 ? Number(page) : 1;
    }
    const take = appConfig.ResultPerPage;
    const where = query.wheres || [];
    const order = query.orders || {};
    let queryBuilder = this.contractTemplateRepository.createQueryBuilder();
    where.forEach((w) => {
      queryBuilder = queryBuilder.andWhere('ContractTemplate.' + w);
    });
    queryBuilder = queryBuilder.orderBy(order);

    const count = queryBuilder.getCount();
    // const getMany = queryBuilder.limit(take).offset(offset).getMany();
    let getMany;
    if (page === 'all') {
      getMany = queryBuilder.getMany();
    } else {
      getMany = queryBuilder
        .skip((page - 1) * take)
        .take(take)
        .getMany();
    }
    const [contract_templates, total] = await Promise.all([getMany, count]);
    return {
      number_of_pages: Math.ceil(total / take),
      contract_templates,
    };
  }

  public async createContractTemplate(data: Record<string, any>): Promise<ContractTemplate> {
    const constractTemplate = new ContractTemplate();
    constractTemplate.template_name = data.template_name;
    constractTemplate.content = data.content;
    constractTemplate.is_active = data.is_active;
    return await this.contractTemplateRepository.save(constractTemplate);
  }

  public async updateContractTemplate(id: string, data: Partial<IContractTemplate>): Promise<void> {
    delete data.id;
    delete data.created_at;
    delete data.deleted_at;
    await this.contractTemplateRepository.update(id, data);
  }

  public async deleteContractTemplate(id: string): Promise<void> {
    await this.contractTemplateRepository.softDelete(id);
  }
}

export default ContractTemplateService;
