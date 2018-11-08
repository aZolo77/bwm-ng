import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperModule } from 'ngx-image-cropper';

import { ImageUploadComponent } from './image-upload.component';
import { ImageUploadService } from './image-upload.service';

@NgModule({
  declarations: [ImageUploadComponent],
  imports: [CommonModule, ImageCropperModule],
  exports: [ImageUploadComponent],
  providers: [ImageUploadService]
})
export class ImageUploadModule {}
