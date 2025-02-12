import { Component, Input } from "@angular/core";
import { BlockByType, BlockTypes } from "@gongsho/text-to-blocks";
import { Highlight } from 'ngx-highlightjs';

@Component({
  selector: 'app-bash-block',
  template: `
    <pre><code [highlight]="block.command" language="bash"></code></pre>
  `,
  imports: [Highlight],
})
export class BashBlockComponent {
  @Input() block!: BlockByType<typeof BlockTypes.BASH>;
} 