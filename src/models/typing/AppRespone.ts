type AppResponse = {
  status: 'success' | 'fail' | 'error';
  code: number;
  message: string;
  result?: any;
  error?: any;
  num_of_pages?: number;
};

export default AppResponse;
