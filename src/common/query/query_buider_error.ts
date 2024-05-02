type QueryBuilderError = {
  param: string;
  message: string;
  supportOperator?: string[];
  value: any;
};

export { QueryBuilderError };
