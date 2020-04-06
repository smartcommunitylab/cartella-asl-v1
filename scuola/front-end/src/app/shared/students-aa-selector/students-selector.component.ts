import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { PaginationComponent } from '../pagination/pagination.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { ConfirmModalComponent} from './modals/confirm-modal/confirm-modal.component'

@Component({
  selector: 'cm-students-selector',
  templateUrl: './students-selector.component.html',
  styleUrls: ['./students-selector.component.scss']
})
export class StudentsSelectorComponent implements OnInit {

  @Input() attachedStudenti: any;
  @Input() attachedStudentButtonText: string;
  @Input() warningText: string;
  @Input() attivitaTitolo: string;
  @Input() popupTitle: string;
  @Input() popupText: string;
  @Input() attachedAttivitaInfoText: string;
  @Input() blockCompleteOperation: boolean;
  @Output() onNewStudentAddedListener = new EventEmitter<any>();

  @ViewChild('cmPagination') cmPagination: PaginationComponent;

  totalRecords: number = 0;
  pageSize: number = 10;
  studentArray;
  studentIds;
  paged;
  selectAll: boolean = false;

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    this.studentIds = Object.keys(this.attachedStudenti);
    this.studentArray = Object.values(this.attachedStudenti);
    this.totalRecords = this.studentArray.length;
    this.getStudentWindow(1);
  }

  pageChanged(page: number) {
    this.getStudentWindow(page);
  }

  getStudentWindow(page) {
    this.paged = this.studentArray.slice(this.pageSize * (page - 1), this.pageSize * page);
  }

  onFilterChange(e: any, student) {
    if (!e.target.checked) {
      this.selectAll = false;
    }
    student.completato = e.target.checked;
  }

  onSelectAllChange(e: any) {
    for (let student of this.studentArray) {
      student.completato = e.target.checked;
    }
    this.selectAll = e.target.checked;
  }

  addStudents() {
    const modalRef = this.modalService.open(ConfirmModalComponent, { size: "lg" });
    modalRef.componentInstance.attivitaTitolo = this.attachedAttivitaInfoText;
    modalRef.componentInstance.popupText = this.popupText;
    modalRef.componentInstance.popupTitle = this.popupTitle;
    modalRef.result.then((result) => {
      if (result == 'CONFIRM') {
        console.log('completa attivita' + this.attachedAttivitaInfoText);
        this.onNewStudentAddedListener.emit(this.studentArray);
      }
    });
  }

}

