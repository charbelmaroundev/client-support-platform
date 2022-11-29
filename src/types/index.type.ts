export type Payload = {
  id: string;
};

export type AccessToken = {
  access_token: string;
};

export enum Status {
  PENDING = 'pending',
  INPROGRESS = 'inprogress',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

export enum Sort {
  ASC = 'asc',
  DESC = 'desc',
}
