import bcrypt from "bcrypt";

export const encrypt = async (password) => {
  try {
    if (!password) throw new Error("password is required");
    const saltRounds = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (e) {
    throw new Error(e);
  }
};

export async function compare(hash, password) {
  try {
    if (!password) throw new Error("password is required");
    const match = await bcrypt.compare(password, hash);
    if (match) {
      return true;
    }
    return false;
  } catch (e) {
    throw new Error(e);
  }
}
