export type MockContext = {
  /** Query string parameters parsed from the request path. */
  query: URLSearchParams;
  /** FormData body, when the request carries one. */
  body?: FormData;
  /** HTTP method of the request. */
  method: string;
  /** Path without the query string and without a trailing `.php`. */
  pathname: string;
};

export type MockHandler = (ctx: MockContext) => Response | Promise<Response>;

export type MockHandlers = Record<string, MockHandler>;
