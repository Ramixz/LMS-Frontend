import { jwtDecode } from "jwt-decode";
import useAuthStorage from "./useAuthStorage";
function useTokenData() {
  const { access_token } = useAuthStorage();
  const decodedToken: {
    email: string;
    firstName: string;
    lastName: string;
    user_id: string;
    tenant_id: string;
    sub: string;
  } = access_token
    ? jwtDecode(`Bearer ${access_token}`)
    : {
        email: "",
        firstName: "",
        lastName: "",
        user_id: "",
        tenant_id: "",
        sub: "",
      };

  return decodedToken;
}

export default useTokenData;
 