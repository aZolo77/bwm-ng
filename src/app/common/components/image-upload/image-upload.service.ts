import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ImageUploadService {
  constructor(private http: HttpClient) {}

  // upload image
  public uploadImage(image: File): Observable<string | any> {
    // create FormData for request in server
    const formData = new FormData();

    // append key('image' from server config) and the image itself
    formData.append('image', image);

    return this.http
      .post('/api/v1/image-upload', formData)
      .map((json: any) => json.imageUrl);
  }
}
