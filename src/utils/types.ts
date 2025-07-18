export type ActionType = {
  success: boolean;
  message: string;
};

export type LoginType = ActionType & { twoStep?: boolean };
