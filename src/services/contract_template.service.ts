import { Service } from 'typedi';
import { Repository, DataSource } from 'typeorm';
import { InsertResult } from 'typeorm/browser';
import { Equal } from 'typeorm/browser';
import ContractTemplate, { IContractTemplate } from '~/models/databases/ContractTemplate';
import { BaseQuery } from '~/models/typing/base_query';

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
    const page = query.page || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const where = query.wheres || [];
    const order = query.orders || {};
    var queryBuilder = this.contractTemplateRepository.createQueryBuilder();
    where.forEach((w) => {
      queryBuilder = queryBuilder.andWhere('ContractTemplate.' + w);
    });
    queryBuilder = queryBuilder.orderBy(order);

    const count = queryBuilder.getCount();
    const getMany = queryBuilder.limit(limit).offset(offset).getMany();

    const [contract_templates, total] = await Promise.all([getMany, count]);
    return {
      number_of_pages: Math.ceil(total / limit),
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
