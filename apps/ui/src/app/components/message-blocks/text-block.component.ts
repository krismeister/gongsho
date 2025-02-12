import { Component, Input } from '@angular/core';
import { BlockByType, BlockTypes } from '@gongsho/text-to-blocks';

@Component({
  selector: 'app-text-block',
  template: `
    <div class="whitespace-pre-wrap">
      {{ block.content }}
    </div>
  `,
})
export class TextBlockComponent {
  @Input() block!: BlockByType<typeof BlockTypes.TEXT>;
}