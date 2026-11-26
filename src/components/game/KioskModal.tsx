import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function KioskModal({ open, onOpenChange, title, closeLabel, children, showcase = false }: {
  open: boolean; onOpenChange: (open: boolean) => void; title: string; closeLabel: string; children: ReactNode; showcase?: boolean;
}) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  useEffect(() => { setContainer(document.getElementById("kiosk-frame")); }, []);
  return <Dialog.Root open={open} onOpenChange={onOpenChange}>
    {container && <Dialog.Portal container={container}>
      <Dialog.Overlay className="kiosk-overlay" />
      <Dialog.Content className={showcase ? "kiosk-modal wildlife-modal" : "kiosk-modal kiosk-drawer"} aria-describedby={undefined}>
        <div className="drawer-heading">
          <Dialog.Title className="drawer-title">{title}</Dialog.Title>
          <Dialog.Close asChild><Button variant="glass" size="kiosk" className="icon-control" aria-label={closeLabel} title={closeLabel}><X /></Button></Dialog.Close>
        </div>
        {children}
      </Dialog.Content>
    </Dialog.Portal>}
  </Dialog.Root>;
}