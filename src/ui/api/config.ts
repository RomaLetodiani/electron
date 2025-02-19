import axios from "axios";
import { constants } from "@/utils/constants";

export const api = axios.create({
  baseURL: `${constants.baseApiDomain}/api`,
});
