export interface IGetMany {
  page?: number;
  perPage?: number;
  order?: string;
  field?: string;
  ids?: string[];
}

export interface IQueryIds {
  ids: string[];
}
