import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { Overlay as OverlayProps } from '@/types/overlay.type';
import { CopyIcon, PencilIcon, PlusIcon, OctagonAlertIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@nexsoft-admin/ui/alert-dialog';
import { Button } from '@nexsoft-admin/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@nexsoft-admin/ui/dialog';
import { ScrollArea } from '@nexsoft-admin/ui/scroll-area';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@nexsoft-admin/ui/sheet';
import { toast } from 'sonner';
import { useOverlayStore } from '@/stores/overlay.store';

function Overlay({
  id,
  isTop,
  kind,
  mode,
  formId = 'modal-form',
  title,
  description,
  children,
  beforeSubmit,
  onSubmit,
  afterSubmit,
  onCancel,
  cancelLabel,
  confirmLabel,
}: OverlayProps) {
  const close = useOverlayStore((s) => s.closeById);

  const isDelete = mode === 'delete';
  const isCreate = mode === 'create';
  const isUpdate = mode === 'update';
  const isDuplicate = mode === 'duplicate';

  const getActionTitle = () => {
    if (title) return title;
    if (isCreate) return t`Create a new item`;
    if (isUpdate) return t`Update an existing item`;
    if (isDuplicate) return t`Duplicate an existing item`;
    if (isDelete) return t`Are you absolutely sure you want to delete this item?`;
    return '';
  };

  const getActionDescription = () => {
    if (description) return description;
    if (isDelete) {
      return t`This action cannot be undone.`;
    }
    return '';
  };

  const getActionIcon = () => {
    if (isCreate) return <PlusIcon className='size-5' />;
    if (isUpdate) return <PencilIcon className='size-5' />;
    if (isDuplicate) return <CopyIcon className='size-5' />;
    return null;
  };

  const handleClose = async () => {
    console.log('Overlay closed:', 'with mode:', mode);
    if (onCancel) {
      await onCancel(mode);
    }
    close(id);
  };

  const handleSubmit = async () => {
    if (!onSubmit || !mode) return;

    try {
      // Call beforeSubmit
      if (beforeSubmit) {
        await beforeSubmit(mode);
      }

      // Call onSubmit
      await onSubmit(mode);

      // Call afterSubmit
      if (afterSubmit) {
        await afterSubmit(mode);
      }

      close(id);
    } catch (error) {
      console.error('Error submitting overlay:', error);
      toast.error('Modal submit error');
    }
  };

  if (isDelete) {
    return (
      <AlertDialog open={isTop} onOpenChange={handleClose}>
        <AlertDialogContent>
          <AlertDialogHeader className='items-center'>
            <AlertDialogTitle>
              <div className='bg-destructive/10 mx-auto mb-2 flex size-14 items-center justify-center rounded-full'>
                <OctagonAlertIcon className='text-destructive size-7' />
              </div>
              {getActionTitle()}
            </AlertDialogTitle>
            <AlertDialogDescription className='text-center'>{getActionDescription()}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='mt-2 sm:justify-center'>
            <AlertDialogCancel>{cancelLabel ? cancelLabel : <Trans>Cancel</Trans>}</AlertDialogCancel>
            <AlertDialogAction variant='destructive' onClick={handleSubmit}>
              {confirmLabel ? confirmLabel : <Trans>Delete</Trans>}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  const content = (
    <ScrollArea className='max-h-[60vh] lg:max-h-fit'>
      <div className='space-y-6 p-1'>{children}</div>
    </ScrollArea>
  );

  if (kind === 'sheet') {
    return (
      <Sheet open={isTop} onOpenChange={handleClose}>
        <SheetContent side='right'>
          <SheetHeader>
            <SheetTitle>
              <div className='flex items-center gap-2.5'>
                {getActionIcon()}
                <h2>{getActionTitle()}</h2>
              </div>
            </SheetTitle>
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
          {content}
          <SheetFooter>
            <Button type='submit' form={formId} onClick={handleSubmit}>
              {confirmLabel ? (
                confirmLabel
              ) : isCreate ? (
                <Trans>Create</Trans>
              ) : isUpdate ? (
                <Trans>Save Changes</Trans>
              ) : (
                <Trans>Duplicate</Trans>
              )}
            </Button>
            <Button type='button' variant='ghost' onClick={handleClose}>
              {cancelLabel ? cancelLabel : <Trans>Cancel</Trans>}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isTop} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className='flex items-center gap-2.5'>
              {getActionIcon()}
              <h2>{getActionTitle()}</h2>
            </div>
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {content}
        <DialogFooter>
          <Button type='button' variant='ghost' onClick={handleClose}>
            {cancelLabel ? cancelLabel : <Trans>Cancel</Trans>}
          </Button>
          <Button type='submit' form={formId} onClick={handleSubmit}>
            {confirmLabel ? (
              confirmLabel
            ) : isCreate ? (
              <Trans>Create</Trans>
            ) : isUpdate ? (
              <Trans>Save Changes</Trans>
            ) : (
              <Trans>Duplicate</Trans>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { Overlay };
