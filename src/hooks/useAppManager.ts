import { useELcheckPermissions } from "./useELcheckPermissions";
import { usePermissions } from "./usePermissions";

export const useAppManager = () => {
  const permissions = usePermissions();
  const { checkPermissions } = permissions;

  useELcheckPermissions(checkPermissions);

  return { permissions };
};
