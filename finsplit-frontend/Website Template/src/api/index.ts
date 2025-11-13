// Главный файл экспорта всех API сервисов

export * from './types';
export * from './config';
export { authApi } from './auth.api';
export { accountsApi } from './accounts.api';
export { transactionsApi } from './transactions.api';
export { filesApi } from './files.api';

// Удобный объект для импорта всех API
import { authApi } from './auth.api';
import { accountsApi } from './accounts.api';
import { transactionsApi } from './transactions.api';
import { filesApi } from './files.api';

export const api = {
  auth: authApi,
  accounts: accountsApi,
  transactions: transactionsApi,
  files: filesApi,
};

