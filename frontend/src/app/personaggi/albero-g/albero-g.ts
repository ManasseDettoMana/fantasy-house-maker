import { Component } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { OrganizationChartModule } from 'primeng/organizationchart';
@Component({
  selector: 'app-albero-g',
  imports: [OrganizationChartModule],
  templateUrl: './albero-g.html',
  styleUrl: './albero-g.scss',
})
export default class AlberoG {
  data!: TreeNode[];
}
