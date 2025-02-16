import { Component, Input } from "@angular/core";
import { BlockByType, BlockTypes } from "@gongsho/text-to-blocks";
import { HighlightAuto } from 'ngx-highlightjs';


// TODO: once gongsho reliably gives the language, we can use the language to highlight the code
// import { Highlight } from 'ngx-highlightjs';
// <pre><code [highlight]="block.to" [language]="block.language"></code></pre>

@Component({
  selector: 'app-code-block',
  standalone: true,
  template: `
    <div class="mb-2">
      <pre><code [highlightAuto]="block.content"></code></pre>
    </div>
  `,
  imports: [HighlightAuto]
})
export class CodeBlockComponent {
  @Input() block!: BlockByType<typeof BlockTypes.BACKTICK_CODE>;
} 