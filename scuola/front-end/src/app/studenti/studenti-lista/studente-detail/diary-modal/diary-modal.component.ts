import { Component, Input, EventEmitter } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../../../core/services/data.service'
import { Attivita } from '../../../../shared/classes/Attivita.class';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'diary-modal',
  templateUrl: './diary-modal.component.html',
  styleUrls: ['./diary-modal.component.css']
})
export class DiaryModal implements OnInit {

  closeResult: string;
  esperienza;
  tipologie;
  attivitaCompatibili;

  @Input() attivitaSvolta: string;

  constructor(public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private dataService: DataService) {

  }
  ngOnInit(): void {
    //search and show opportunities

  }
}
