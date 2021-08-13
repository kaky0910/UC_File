export default interface File {
  file_name: string;
  remote_url: string;
  file_size: number;
  expire_date: Date;
  file_extension: string;
}

export type { File }