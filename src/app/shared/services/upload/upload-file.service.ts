import { Injectable, NgZone } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { FileUpload } from 'src/app/models/UploadFile.model';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  private basePath = '/uploads';

  constructor(private db: AngularFireDatabase,
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone
  ) { }

  pushFileToStorage(fileUpload: FileUpload, progress: { percentage: number }) {
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`${this.basePath}/${fileUpload.file.name}`).put(fileUpload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        
        const snap = snapshot as firebase.storage.UploadTaskSnapshot;
        progress.percentage = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
       // progress.transferred = Math.round(snap.bytesTransferred );
      },
      (error) => {
        
        console.log(error);
      },
      () => {
        // success
        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
          console.log('File available at', downloadURL);

          fileUpload.url = downloadURL;
          fileUpload.name = fileUpload.file.name;
          fileUpload.size = fileUpload.file.size;
          fileUpload.type = fileUpload.file.type;

          const user = JSON.parse(localStorage.getItem('user'));
          fileUpload.email = user.email;
          fileUpload.userId = user.uid; 

          this.saveFileData(fileUpload);
        });
      }
    );
  }

  private saveFileData(fileUpload: FileUpload) {
    this.db.list(`${this.basePath}/`).push(fileUpload);
  }

  getFileUploads(numberItems): AngularFireList<FileUpload> {
    return this.db.list(this.basePath, ref =>
      ref.limitToLast(numberItems));
  }

  getFilesList(): AngularFireList<FileUpload> {
    return this.db.list(this.basePath);
  }

  deleteFileUpload(fileUpload: FileUpload) {
    this.deleteFileDatabase(fileUpload.key)
      .then(() => {
        this.deleteFileStorage(fileUpload.name);
      })
      .catch(error => console.log(error));

  }

  private deleteFileDatabase(key: string) {
    return this.db.list(`${this.basePath}/`).remove(key);
  }

  private deleteFileStorage(name: string) {
    const storageRef = firebase.storage().ref();
    storageRef.child(`${this.basePath}/${name}`).delete();
  }
}
