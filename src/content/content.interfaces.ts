export interface IGetMany {
  limit?: number;
  start?: number;
  order?: string;
  field?: string;
  ids?: string[];
}
