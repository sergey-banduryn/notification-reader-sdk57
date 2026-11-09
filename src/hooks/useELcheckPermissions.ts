import { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";

export function useELcheckPermissions(checkPermissions: () => void) {
  useEffect(() => {
    checkPermissions();

    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          checkPermissions();
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, [checkPermissions]);
}
