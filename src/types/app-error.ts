export class ExternalApiError extends Error {
  public readonly statusCode = 503;
  public readonly details: string;

  constructor(apiName: string) {
    super("External data source unavailable");

    this.name = "ExternalApiError";
    this.details = `Could not fetch data from ${apiName}`;

    Object.setPrototypeOf(this, ExternalApiError.prototype);
  }
}
