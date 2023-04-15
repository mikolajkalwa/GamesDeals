export type NotifyJob = {
  webhook: {
    id: string,
    token: string,
  },
  content: string,
  threadName: string | undefined
};
