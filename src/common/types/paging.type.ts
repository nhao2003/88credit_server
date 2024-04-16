type Paging<T> = {
    items: T[];
    page: number;
    limit: number;
    totalPages: number;
};

export default Paging;