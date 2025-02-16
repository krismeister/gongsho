import { Component, Input } from "@angular/core";
import { BlockByType, BlockTypes } from "@gongsho/text-to-blocks";
import { HighlightAuto } from 'ngx-highlightjs';


// TODO: once gongsho reliably gives the language, we can use the language to highlight the code
// import { Highlight } from 'ngx-highlightjs';
// <pre><code [highlight]="block.to" [language]="block.language"></code></pre>

@Component({
  selector: 'app-replace-block',
  standalone: true,
  template: `
    <div class="text-sm font-mono text-sm font-bold py-1 bg-gray-300 dark:bg-gray-700 rounded-tl-md rounded-tr-md p-2 mb-0">{{ block.file }}</div>
    <div class="mb-2">
      <pre><code [highlightAuto]="block.to"></code></pre>
    </div>
  `,
  imports: [HighlightAuto]
})
export class ReplaceBlockComponent {
  @Input() block!: BlockByType<typeof BlockTypes.REPLACE>;
} 