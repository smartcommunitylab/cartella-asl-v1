import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillsSelectorComponent } from './skills-selector.component'
import { BrowserModule } from '@angular/platform-browser/src/browser';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { PaginationModule } from '../shared/pagination/pagination.module';

@NgModule({
  imports: [ FormsModule, CommonModule, PaginationModule ],
  exports: [ SkillsSelectorComponent ],
  declarations: [ SkillsSelectorComponent ]
})
export class SkillsSelectorModule { }