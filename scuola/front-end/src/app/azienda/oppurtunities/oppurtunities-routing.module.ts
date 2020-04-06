import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OppurtunitiesComponent } from './oppurtunities.component';
import { OppurtunitiesGridComponent } from './list/oppurtunities-grid.component';
import { OppurtunityDetailsComponent } from './details/oppurtunity-details.component';
import { OppurtunityEditComponent } from './edit/oppurtunity-edit.component';
import { OpportunitaGuideComponent } from './guida/pianifica-guide.component';
import { SkillsSelectorComponent } from './skills-selector/skills-selector.component';

const routes: Routes =[];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OppurtunitiesRoutingModule {
  static components = [
    OppurtunitiesComponent,
    OppurtunitiesGridComponent,
    OppurtunityDetailsComponent,
    OppurtunityEditComponent,
    OpportunitaGuideComponent,
    SkillsSelectorComponent];
}




