export default class CommandError extends Error {
  public readonly description: string;

  public readonly isOperational: boolean;

  public readonly interactionOptions: Record<string, unknown>;

  constructor(message: string, interactionOptions: Record<string, unknown>, isOperational = true) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.description = message;
    this.isOperational = isOperational;
    this.interactionOptions = interactionOptions;

    Error.captureStackTrace(this);
  }
}
