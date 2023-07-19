import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { STORAGE_KEY, STORAGE_URL } from "src/config";

@Injectable()
export class FileSystemService {
  private storageUrl: string;
  private authToken: string;

  constructor(private readonly httpService: HttpService) {
    this.storageUrl = STORAGE_URL;
    this.authToken = STORAGE_KEY;
    
  }

  private bufferToBlob(buffer: Buffer): Blob {
    // In Node.js, we need to create a Blob from a Buffer manually
    return new Blob([buffer]);
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', this.bufferToBlob(file.buffer), file.originalname);

      const headers = {
        Authorization: `Bearer ${this.authToken}`,
        // ...formData.getHeaders(),
      };
      const url = `${this.storageUrl}/s5/upload?auth_token=${this.authToken}`;
      const response = await this.httpService.axiosRef.post<{
        cid: string
      }>(url, formData, {
        headers,
      });

      return response?.data?.cid ?? ""; // Assuming the response contains the URL of the uploaded file
    } catch (error) {
      throw new Error('Failed to upload file to storage.' + error);
    }
  }

  async downloadFile(cid: string): Promise<Blob> {
    try {
      const url = `${this.storageUrl}/${cid}?auth_token=${this.authToken}`;

      const response = await this.httpService.axiosRef.get(url, {
        responseType: 'arraybuffer', // We expect a binary response
      });

      const blobData = await this.bufferToBlob(response.data);
      return blobData;
    } catch (error) {
      throw new Error('Failed to download file from storage.');
    }
  }
}

