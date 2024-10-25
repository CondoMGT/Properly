import bcrypt from "bcryptjs";

export const saltAndHashPassword = async (password: any) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const comparePassword = async (password: any, hash: any) => {
  const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
};
