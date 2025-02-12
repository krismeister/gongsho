import { Component, Input } from "@angular/core";
import { BlockByType, BlockTypes } from "@gongsho/text-to-blocks";

@Component({
  selector: 'app-examine-block',
  template: `
    <div class="p-2">
      <ul class="list-none p-0 m-0">
        @for (file of block.files; track file) {
          <li class="font-mono text-sm font-bold py-1 list-decimal ml-4">{{ file }}</li>
        }
      </ul>
    </div>
  `
})
export class ExamineBlockComponent {
  @Input() block!: BlockByType<typeof BlockTypes.EXAMINE>;
} 