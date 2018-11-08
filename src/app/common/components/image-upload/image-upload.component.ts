import {
  Component,
  EventEmitter,
  Output,
  ViewContainerRef
} from '@angular/core';
import { ImageUploadService } from './image-upload.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { HttpErrorResponse } from '@angular/common/http';

class FileSnippet {
  static readonly IMAGE_SIZE = { width: 950, height: 720 };

  pending: boolean = false;
  status: string = 'INIT';

  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'bwm-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent {
  @Output()
  imageUploaded = new EventEmitter<any>();
  @Output()
  imageError = new EventEmitter<any>();
  // emmiting that image is loaded to cropper
  @Output()
  imageLoadedToContainer = new EventEmitter<any>();
  // emmiting that image is canceled to cropper
  @Output()
  croppingCanceled = new EventEmitter<any>();

  selectedFile: FileSnippet;
  // image cropper var
  imageChangedEvent: any;

  constructor(
    private imageUploadService: ImageUploadService,
    private toastr: ToastsManager,
    vcr: ViewContainerRef
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  private onSuccess(imageUrl: string) {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'OK';
    this.imageChangedEvent = null;
    this.imageUploaded.emit(imageUrl);
  }

  private onFailure(err) {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'FAIL';
    this.imageChangedEvent = null;
    this.imageError.emit(err);
  }

  // cropping image
  imageCropped(file: File): FileSnippet | File {
    if (this.selectedFile) {
      return (this.selectedFile.file = file);
    }

    return (this.selectedFile = new FileSnippet('', file));
  }

  // uploading file on change
  processFile(event: any) {
    // reseting file when uploading new
    this.selectedFile = undefined;

    const URL = window.URL;
    let file, img;

    // check for filetype and if there is any file at all uploading
    if (
      (file = event.target.files[0]) &&
      (file.type === 'image/png' || file.type === 'image/jpeg')
    ) {
      // creating image instance of a file-object
      img = new Image();

      const self = this;

      // assigning cb when img will be loaded
      img.onload = function() {
        // if file width or height is bigger then we need, we shell use cropper
        if (
          this.width > FileSnippet.IMAGE_SIZE.width &&
          this.height > FileSnippet.IMAGE_SIZE.height
        ) {
          // assigning file to cropper variable
          self.imageChangedEvent = event;
        } else {
          self.toastr.error(
            `Minimum width is ${
              FileSnippet.IMAGE_SIZE.width
            }px and minimum height is ${FileSnippet.IMAGE_SIZE.height}px`,
            'Error!'
          );
        }
      };

      img.src = URL.createObjectURL(file);
    } else {
      this.toastr.error(
        'Unsupported file type. Only JPEG and PNG are allowed',
        'Error!'
      );
    }
  }

  // event after image is loaded to cropper
  imageLoaded() {
    this.imageLoadedToContainer.emit();
  }

  cancelCropping() {
    this.imageChangedEvent = null;
    this.croppingCanceled.emit();
  }

  uploadImage() {
    if (this.selectedFile) {
      // object to work with files
      const reader = new FileReader();

      reader.addEventListener('load', (event: any) => {
        // assigning src to image if its size is OK
        this.selectedFile.src = event.target.result;
        // set  pending
        this.selectedFile.pending = true;

        this.imageUploadService.uploadImage(this.selectedFile.file).subscribe(
          (imageUrl: string) => {
            this.onSuccess(imageUrl);
          },
          (err: HttpErrorResponse) => {
            this.toastr.error(err.error.errors[0].detail, 'Error!');
            this.onFailure(err);
          }
        );
      });

      // emitting and adding attributes to file
      reader.readAsDataURL(this.selectedFile.file);
    }
  }
}
