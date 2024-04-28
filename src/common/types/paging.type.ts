type Paging<T> = {
  items: T[];
  page: number;
  take: number;
  totalPages: number;
};

export default Paging;
