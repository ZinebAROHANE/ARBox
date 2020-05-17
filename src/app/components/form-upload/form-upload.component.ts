import { Component, OnInit } from '@angular/core';
import { UploadFileService } from 'src/app/shared/services/upload-file.service';
import { FileUpload } from 'src/app/models/UploadFile.model';
import { map } from 'rxjs/operators';
import { DispoService } from 'src/app/shared/services/dispo.service';

@Component({
  selector: 'app-form-upload',
  templateUrl: './form-upload.component.html',
  styleUrls: ['./form-upload.component.css']
})
export class FormUploadComponent implements OnInit {

  fileUploads: any[];
  selectedFiles: FileList;
  currentFileUpload: FileUpload;
  progress: { percentage: number } = { percentage: 0 };
 
  constructor(private uploadService: UploadFileService, private dispoService: DispoService) {
   }
 
  ngOnInit() {
    console.log('size' + this.dispoService.getDispo());
    let dispo = this.dispoService.getDispo();
    document.getElementById('size').innerHTML = 'L espace de stackage disponible : '+ dispo + ' octets';
  }
 
  selectFile(event) {
    this.selectedFiles = event.target.files;
  }
 
  upload() {

    let tailleFile = 0;
    let dispo = this.dispoService.getDispo(); 
    

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
          tailleFile = tailleFile+file.size;
        }
      }

      this.dispoService.setUserDispo(dispo-tailleFile);

      console.log('tailleFile => '+tailleFile);
      const file = this.selectedFiles.item(0);
      if( tailleFile>= dispo){  
          document.getElementById('size').innerHTML = 'Espace insuffisant '; 
        }

       else{ 
        const file = this.selectedFiles.item(0);
        this.selectedFiles = undefined;
        this.currentFileUpload = new FileUpload(file);
        this.uploadService.pushFileToStorage(this.currentFileUpload, this.progress);

        console.log('espace disponible '+dispo );
        console.log("taille"+ tailleFile);

        dispo = dispo - tailleFile; 
        if(dispo<0){
          dispo = dispo +tailleFile;
        }
          document.getElementById('size').innerHTML = 'L espace de stockage disponile:'+ dispo + ' octets';
          this.dispoService.setUserDispo(dispo);
      }

      

    });

   


    

  }
  
}
