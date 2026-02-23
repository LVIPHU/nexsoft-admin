import { useState } from 'react';
import { Card, CardContent } from '@nexsoft-admin/ui/card';
import { Button } from '@nexsoft-admin/ui/button';
import { Input } from '@nexsoft-admin/ui/input';
import { Separator } from '@nexsoft-admin/ui/separator';
import { PencilIcon } from 'lucide-react';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import { toast } from 'sonner';

interface FeeItem {
  id: string;
  label: string;
  value: string;
}

const DEFAULT_FEES: FeeItem[] = [
  { id: 'usdt-basic', label: 'USDT transfer fee (Basic)', value: '1 USDT' },
  { id: 'usdt-additional', label: 'USDT transfer fee (Additional charges)', value: '2 USDT' },
  { id: 'trx', label: 'TRX transfer fee', value: '4 TRX' },
];

interface TransferFeesProps {
  className?: string;
}

function TransferFees({ className }: TransferFeesProps) {
  const [fees, setFees] = useState<FeeItem[]>(DEFAULT_FEES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  function handleEditClick(item: FeeItem) {
    setEditingId(item.id);
    setEditValue(item.value);
  }

  function handleEditConfirm() {
    if (editingId) {
      setFees((prev) => prev.map((f) => (f.id === editingId ? { ...f, value: editValue } : f)));
      setEditingId(null);
      setEditValue('');
    }
  }

  function handleEditKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleEditConfirm();
    if (e.key === 'Escape') {
      setEditingId(null);
      setEditValue('');
    }
  }

  function handleSave() {
    toast.success(i18n._(msg`Saved`));
  }

  return (
    <div className={className}>
      <Card>
        <CardContent className='flex flex-col gap-0'>
          {fees.map((item, index) => (
            <div key={item.id}>
              {index > 0 && <Separator />}
              <div className='flex items-center justify-between gap-4 py-4'>
                <span className='text-sm'>{item.label}</span>
                <div className='flex items-center gap-2'>
                  {editingId === item.id ? (
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleEditConfirm}
                      onKeyDown={handleEditKeyDown}
                      className='h-8 w-24'
                      autoFocus
                    />
                  ) : (
                    <span className='text-sm'>{item.value}</span>
                  )}
                  <Button
                    variant='ghost'
                    size='icon'
                    className='text-muted-foreground size-8 shrink-0'
                    onClick={() => (editingId === item.id ? handleEditConfirm() : handleEditClick(item))}
                  >
                    <PencilIcon className='size-4' />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <div className='flex justify-end pt-4'>
            <Button onClick={handleSave}>{i18n._(msg`Save Information`)}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { TransferFees };
