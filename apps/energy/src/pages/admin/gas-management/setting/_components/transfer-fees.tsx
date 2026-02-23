import { useEffect, useState } from 'react';
import { Card, CardContent } from '@nexsoft-admin/ui/card';
import { Button } from '@nexsoft-admin/ui/button';
import { Input } from '@nexsoft-admin/ui/input';
import { Separator } from '@nexsoft-admin/ui/separator';
import { PencilIcon } from 'lucide-react';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import { toast } from 'sonner';
import type { ConfigResponseDto, ConfigPayloadDto } from '@nexsoft-admin/models';
import { useConfig, useUpdateConfig } from '@/services/setting';

interface FeeItem {
  id: string;
  label: string;
  value: number;
  unit: string;
}

function configToFeeItems(config: ConfigResponseDto['Config']): FeeItem[] {
  return [
    {
      id: 'usdt-basic',
      label: 'USDT transfer fee (Basic)',
      value: config.transfer_usdt.usdt_payment.basic_fee_usdt,
      unit: 'USDT',
    },
    {
      id: 'usdt-additional',
      label: 'USDT transfer fee (Additional charges)',
      value: config.transfer_usdt.usdt_payment.advance_fee_usdt,
      unit: 'USDT',
    },
    {
      id: 'trx',
      label: 'TRX transfer fee',
      value: config.transfer_trx.trx_payment.fee_trx_amount,
      unit: 'TRX',
    },
  ];
}

function buildPayload(config: ConfigResponseDto['Config'], fees: FeeItem[]): ConfigPayloadDto {
  const basic = fees.find((f) => f.id === 'usdt-basic')?.value ?? 0;
  const advanceUsdt = fees.find((f) => f.id === 'usdt-additional')?.value ?? 0;
  const feeTrx = fees.find((f) => f.id === 'trx')?.value ?? 0;

  return {
    transfer_usdt: {
      ...config.transfer_usdt,
      usdt_payment: {
        ...config.transfer_usdt.usdt_payment,
        basic_fee_usdt: basic,
        advance_fee_usdt: advanceUsdt,
      },
      trx_payment: {
        ...config.transfer_usdt.trx_payment,
        basic_fee_usdt: basic,
        advance_fee_usdt: advanceUsdt,
      },
    },
    transfer_trx: {
      ...config.transfer_trx,
      trx_payment: {
        ...config.transfer_trx.trx_payment,
        fee_trx_amount: feeTrx,
      },
    },
  };
}

interface TransferFeesProps {
  className?: string;
}

const DEFAULT_FEES: FeeItem[] = [
  { id: 'usdt-basic', label: 'USDT transfer fee (Basic)', value: 0, unit: 'USDT' },
  { id: 'usdt-additional', label: 'USDT transfer fee (Additional charges)', value: 0, unit: 'USDT' },
  { id: 'trx', label: 'TRX transfer fee', value: 0, unit: 'TRX' },
];

function TransferFees({ className }: TransferFeesProps) {
  const { data, isLoading, isError, error } = useConfig();
  const { updateConfig, loading: saving } = useUpdateConfig();
  const [fees, setFees] = useState<FeeItem[]>(DEFAULT_FEES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    if (data?.Config) {
      setFees(configToFeeItems(data.Config));
    }
  }, [data]);

  function handleEditClick(item: FeeItem) {
    setEditingId(item.id);
    setEditValue(item.value === 0 ? '' : String(item.value));
  }

  function handleEditConfirm() {
    if (editingId) {
      const num = editValue === '' ? 0 : Number(editValue);
      const parsed = Number.isFinite(num) ? num : 0;
      setFees((prev) => prev.map((f) => (f.id === editingId ? { ...f, value: parsed } : f)));
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

  async function handleSave() {
    if (!data?.Config) return;
    try {
      await updateConfig(buildPayload(data.Config, fees));
      toast.success(i18n._(msg`Saved`));
    } catch {
      toast.error(i18n._(msg`Failed to save`));
    }
  }

  if (isLoading) {
    return (
      <div className={className}>
        <Card>
          <CardContent className='text-muted-foreground py-8 text-center'>{i18n._(msg`Loading...`)}</CardContent>
        </Card>
      </div>
    );
  }

  if (isError && error) {
    return (
      <div className={className}>
        <Card>
          <CardContent className='text-destructive py-8 text-center'>{error.message}</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardContent className='flex flex-col gap-0'>
          {fees.map((item, index) => (
            <div key={item.id}>
              {index > 0 && <Separator />}
              <div className='grid grid-cols-1 py-4 @5xl/main:grid-cols-2'>
                <span className='text-sm'>{item.label}</span>
                <div className='flex items-center justify-between'>
                  {editingId === item.id ? (
                    <Input
                      type='number'
                      min={0}
                      step={1}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleEditConfirm}
                      onKeyDown={handleEditKeyDown}
                      className='h-8 w-24'
                      autoFocus
                    />
                  ) : (
                    <span className='text-sm'>
                      {item.value} {item.unit}
                    </span>
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
            <Button onClick={handleSave} disabled={saving || !data?.Config}>
              {saving ? i18n._(msg`Saving...`) : i18n._(msg`Save Information`)}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { TransferFees };
