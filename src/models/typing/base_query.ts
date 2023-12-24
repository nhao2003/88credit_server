export type BaseQuery = {
  user_id?: string;
  page: number;
  wheres: string[];
  orders: any;
};

export type PostQuery = {
  page: number;
  postWhere: string[];
  order: any;
  userWhere: string[];
  search?: string | null;
};

export type LoanContractRequestQuery = {
  user_id?: string;
  page: number;
  wheres: string[];
  lenderWhere: string[];
  borrowerWhere: string[];
  orders: any;
};

export type ContractQuery = {
  user_id?: string;
  page: number;
  wheres: string[];
  lenderWhere: string[];
  borrowerWhere: string[];
  orders: any;
}
