import { Component, OnInit, Input } from '@angular/core';
import { UploadFileService } from 'src/app/shared/services/upload-file.service';
import { FileUpload } from 'src/app/models/UploadFile.model'
import { map } from 'rxjs/operators';
import { DispoService } from 'src/app/shared/services/dispo.service';

@Component({
  selector: 'app-details-upload',
  templateUrl: './details-upload.component.html',
  styleUrls: ['./details-upload.component.css']
})
export class DetailsUploadComponent implements OnInit {

  @Input() fileUpload: FileUpload;
  fileUploads: any[];

  constructor(private uploadService: UploadFileService, private dispoService: DispoService) { }

  ngOnInit() {
    console.log(this.dispoService.getDispo());
    this.dispoService.setUserDispo(this.dispoService.getDispo());
    console.log(this.dispoService.getDispo());
  }

  deleteFileUpload(fileUpload) {
    this.uploadService.deleteFileUpload(fileUpload);
      
    
    this.uploadService.getFilesList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(fileUploads => {
      this.fileUploads = [];
      const user = JSON.parse(localStorage.getItem('user'));
      for (let file of fileUploads) {
        if (file.email === user.email) {
          this.fileUploads.push(file);
        }
      }

      if(this.fileUploads.length === 0){
        this.dispoService.setUserDispo(100000000); 
      }
      else{
        this.dispoService.setUserDispo(this.dispoService.getDispo()+fileUpload.size); 
      }

    });

    console.log("Espace disponible: " +this.dispoService.getDispo()+ " octets" );
  }
}
