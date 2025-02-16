import { Component, Input } from "@angular/core";
import { BlockTypes, MessageBlock } from "@gongsho/text-to-blocks";
import { BashBlockComponent } from "./bash-block.component";
import { CodeBlockComponent } from "./code-block.component";
import { ExamineBlockComponent } from "./examine-block.component";
import { ReplaceBlockComponent } from "./replace-block.component";
import { TextBlockComponent } from "./text-block.component";

@Component({
  selector: 'app-message-blocks',
  standalone: true,
  imports: [
    TextBlockComponent,
    ReplaceBlockComponent,
    BashBlockComponent,
    ExamineBlockComponent,
    CodeBlockComponent
  ],
  template: `
    <div class="message-blocks">
      @for (block of blocks; track $index) {
        @switch (block.type) {
          @case (BlockTypes.TEXT) {
            <app-text-block 
              [block]="block"
            ></app-text-block>
          }
          @case (BlockTypes.REPLACE) {
            <app-replace-block
              [block]="block"
            ></app-replace-block>
          }
          @case (BlockTypes.BASH) {
            <app-bash-block
              [block]="block"
            ></app-bash-block>
          }
          @case (BlockTypes.EXAMINE) {
            <app-examine-block
              [block]="block"
            ></app-examine-block>
          }
          @case (BlockTypes.BACKTICK_CODE) {
            <app-code-block
              [block]="block"
            ></app-code-block>
          } 
        }
      }
    </div>
  `,
  styles: [`
    .message-blocks {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  `]
})
export class MessageBlocksComponent {
  @Input({ required: true }) blocks!: MessageBlock[];
  protected BlockTypes = BlockTypes;
}