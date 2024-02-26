import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { POLYGON_API_URL } from 'src/config';

interface Transaction {
  blockNumber: number;
  timeStamp: number;
  hash: string;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gasUsed: string;
  confirmations: string;
}

interface BalanceResponse {
  status: string;
  message: string;
  result: string;
}

class Polygonscan {
  private readonly apiKey: string;
  private readonly apiURL: string;
  private axiosInstance: AxiosInstance;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.apiURL = POLYGON_API_URL;
    this.axiosInstance = axios.create({
      baseURL: this.apiURL,
    });
  }

  async getAccountBalance(address: string): Promise<string> {
    try {
      const response: AxiosResponse<BalanceResponse> =
        await this.axiosInstance.get(
          '/?module=account&action=balance&address=' +
            address +
            '&tag=latest&apikey=' +
            this.apiKey,
        );
      const balance = response.data.result;
      return balance;
    } catch (error) {
      console.error('Error fetching account balance:', error);
      throw error;
    }
  }

  async getTransactionHistory(
    address: string,
    type: 'all' | 'internal' | 'normal' = 'all',
  ): Promise<{ normal: Transaction[]; internal: Transaction[] }> {
    try {
      console.log({ address });
      const [response, response1]: AxiosResponse<{ result: Transaction[] }>[] =
        await Promise.all([
          this.axiosInstance.get(
            '/?module=account&action=txlist&address=' +
              address +
              '&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=' +
              this.apiKey,
          ),
          this.axiosInstance.get(
            '/?module=account&action=txlistinternal&address=' +
              address +
              '&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=' +
              this.apiKey,
          ),
        ]);
      const transactions = {
        normal: response.data.result,
        internal: response1.data.result,
      };
      return transactions;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  }
}

export { Polygonscan, Transaction, BalanceResponse };
