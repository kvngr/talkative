export type ReplicateApiError = {
  request: {
    method: string;
    url: string;
    headers: {
      "Content-Type": string;
      "User-Agent": string;
      Authorization: string;
      Prefer: string;
    };
    destination: string;
    referrer: string;
    referrerPolicy: string;
    mode: string;
    credentials: string;
    cache: string;
    redirect: string;
    integrity: string;
    keepalive: boolean;
    isReloadNavigation: boolean;
    isHistoryNavigation: boolean;
    signal: AbortSignal;
  };
  response: {
    status: number;
    statusText: string;
    headers: HeadersInit;
    body: Record<string, unknown>;
    bodyUsed: boolean;
    ok: boolean;
    redirected: boolean;
    type: string;
    url: string;
  };
};
