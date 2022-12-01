type Payload = {
  id: string;
};

type AccessToken = {
  access_token: string;
};

type Options = {
  subject: string;
  text: string;
};

enum Status {
  PENDING = 'pending',
  INPROGRESS = 'inprogress',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

enum Sort {
  ASC = 'asc',
  DESC = 'desc',
}

enum UpDowngrade {
  UPGRADE = 'upgrade',
  DOWNGRADE = 'downgrade',
}

enum VipNonVip {
  VIP = 'vip',
  NONVIP = 'nonvip',
}

export { Payload, AccessToken, Options, Status, Sort, UpDowngrade, VipNonVip };
