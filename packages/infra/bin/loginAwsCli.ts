import path from "path";
import { exec } from "../utils/exec";

interface LoginProps {
  profile: string;
  account: string;
}
export async function loginAwsCli({ profile, account }: LoginProps) {
  const script = path.resolve(__dirname, "login.sh");
  await exec(`${script} ${account} ${profile} admin`, false);
}
