import { cn } from "@/lib/cn";
import { ActionLink } from "@/components/ui/ActionLink";
import { justifyAlign } from "@/lib/blocks/scale";
import type { Action, Align } from "@/content/types";

interface ActionRowProps {
  actions: readonly Action[];
  align?: Align;
  /** Treatment for actions that do not carry their own variant. */
  defaultVariant?: Action["variant"];
  defaultSize?: Action["size"];
  /** Gives the first action a different default — the primary button. */
  leadVariant?: Action["variant"];
  className?: string;
}

/**
 * The one place a list of actions becomes buttons.
 *
 * Each action can carry its own variant and size from the dashboard;
 * the defaults here are what a block falls back to, so existing
 * compositions keep their intended hierarchy.
 */
export function ActionRow({
  actions,
  align = "left",
  defaultVariant = "outline",
  defaultSize = "md",
  leadVariant,
  className,
}: ActionRowProps) {
  if (actions.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-3", justifyAlign[align], className)}>
      {actions.map((action, index) => (
        <ActionLink
          key={`${action.href}-${action.label}-${index}`}
          {...action}
          variant={action.variant ?? (index === 0 && leadVariant ? leadVariant : defaultVariant)}
          size={action.size ?? defaultSize}
        />
      ))}
    </div>
  );
}
