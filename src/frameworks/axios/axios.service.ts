import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { IHttpServices } from 'src/core/abstracts/http-services.abstract';

const axiosInstance = axios.create({
  timeout: 120000,
});

@Injectable()
export class AxiosService implements IHttpServices {
  async get(url: string, config: Record<string, any>) {
    try {
      const response = await axiosInstance.get(url, config);
      if (response?.data?.data) return Promise.resolve(response.data.data);

      if (response?.data?.responseBody)
        return Promise.resolve(response.data.responseBody);
      return Promise.resolve(response?.data);
    } catch (error) {
      if (error?.response?.data) return Promise.reject(error?.response?.data);
      return Promise.reject(error);
    }
  }

  async delete(url: string, config: Record<string, any>) {
    try {
      const response = await axiosInstance.delete(url, config);
      if (response?.data?.data) return Promise.resolve(response.data.data);

      if (response?.data?.responseBody)
        return Promise.resolve(response.data.responseBody);
      return Promise.resolve(response?.data);
    } catch (error) {
      if (error?.response?.data) return Promise.reject(error?.response?.data);
      return Promise.reject(error);
    }
  }

  async post(
    url: string,
    data: Record<string, any>,
    config?: Record<string, any>,
    status: boolean = false,
  ) {
    try {
      const response = await axiosInstance.post(url, data, config);
      if (response?.data?.data)
        return Promise.resolve(
          status
            ? { status: response.status, data: response.data.data }
            : response.data.data,
        );

      if (response?.data?.responseBody)
        return Promise.resolve(
          status
            ? { status: response.status, data: response.data.responseBody }
            : response.data.responseBody,
        );
      return Promise.resolve(
        status
          ? { status: response.status, data: response?.data }
          : response?.data,
      );
    } catch (error) {
      if (error?.response?.data) return Promise.reject(error?.response?.data);
      return Promise.reject(error);
    }
  }

  async patch(
    url: string,
    data: Record<string, any>,
    config: Record<string, any>,
  ) {
    try {
      const response = await axiosInstance.patch(url, data, config);
      if (response?.data?.data) return Promise.resolve(response.data.data);

      if (response?.data?.responseBody)
        return Promise.resolve(response.data.responseBody);
      return Promise.resolve(response?.data);
    } catch (error) {
      if (error?.response?.data) return Promise.reject(error?.response?.data);
      return Promise.reject(error);
    }
  }

  async put(
    url: string,
    data: Record<string, any>,
    config: Record<string, any>,
  ) {
    try {
      const response = await axiosInstance.put(url, data, config);
      if (response?.data?.data) return Promise.resolve(response.data.data);

      if (response?.data?.responseBody)
        return Promise.resolve(response.data.responseBody);
      return Promise.resolve(response?.data);
    } catch (error) {
      if (error?.response?.data) return Promise.reject(error?.response?.data);
      return Promise.reject(error);
    }
  }

  async ping(url: string, config?: Record<string, any>) {
    try {
      const response = await axiosInstance.get(url, config);
      if (response) return Promise.resolve(response);

      if (response?.data?.responseBody)
        return Promise.resolve(response.data.responseBody);
      return Promise.resolve(response?.data);
    } catch (error) {
      if (error?.response?.data) return Promise.reject(error?.response?.data);
      return Promise.reject(error);
    }
  }
}
