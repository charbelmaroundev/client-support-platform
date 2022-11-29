import * as bcrypt from 'bcrypt';

export const hashData = async (data: string) => {
  const salt: string = await bcrypt.genSalt();
  const hash: string = await bcrypt.hash(data, salt);

  return hash;
};
