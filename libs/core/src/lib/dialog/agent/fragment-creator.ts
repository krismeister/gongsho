import { DialogFragment, DialogRoles } from "@gongsho/types";

export const assistantFragment = (id: string, content: string): DialogFragment => {
  return {
    id: id,
    role: DialogRoles.ASSISTANT_FRAGMENT,
    dialogRole: DialogRoles.ASSISTANT_FRAGMENT,
    description: 'Assistant Fragment',
    content,
  };
};
