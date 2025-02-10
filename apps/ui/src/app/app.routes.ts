import { Routes } from '@angular/router';
import { ComponentsTestComponent } from './pages/components-test/components-test';
import { ConversationComponent } from './pages/conversation/conversation.component';
import { NewConversationComponent } from './pages/new-conversation/new-conversation.component';

export const appRoutes: Routes = [
    {
        path: 'components-test',
        component: ComponentsTestComponent
    },
    {
        path: 'new-conversation',
        component: NewConversationComponent,
        title: 'Create New Conversation'
    },
    {
        path: 'conversations/:id',
        component: ConversationComponent
    }
];