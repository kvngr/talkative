import { ReplicateApiError } from "@/types/replicate";

export function isReplicateFetchError(error: any): error is ReplicateApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    typeof error.response === "object" &&
    error.response !== null &&
    typeof error.response.status === "number" &&
    typeof error.response.statusText === "string"
  );
}
