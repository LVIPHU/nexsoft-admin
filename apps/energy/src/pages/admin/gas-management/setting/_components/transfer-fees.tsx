import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@nexsoft-admin/ui/card';
import { Button } from '@nexsoft-admin/ui/button';
import { Input } from '@nexsoft-admin/ui/input';
import { Separator } from '@nexsoft-admin/ui/separator';
import { Skeleton } from '@nexsoft-admin/ui/skeleton';
import { PencilIcon } from 'lucide-react';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import { toast } from 'sonner';
import type { ConfigResponseDto, ConfigPayloadDto } from '@nexsoft-admin/models';
import { useConfig, useUpdateConfig } from '@/services/setting';

interface FeeItem {
  id: string;
  label: string;
  description: string;
  value: number;
  unit: string;
}

interface FeeSection {
  groupLabel: string;
  items: FeeItem[];
}

interface FeeCard {
  title: string;
  description: string;
  sections: FeeSection[];
}

function get(fees: FeeItem[], id: string) {
  return fees.find((f) => f.id === id)?.value ?? 0;
}

function configToFeeItems(config: ConfigResponseDto['Config']): FeeItem[] {
  return [
    {
      id: 'usdt_usdt_basic',
      label: i18n._(msg`Basic Fee`),
      description: i18n._(msg`Base fee applied when paying with USDT`),
      value: config.transfer_usdt.usdt_payment.basic_fee_usdt,
      unit: 'USDT',
    },
    {
      id: 'usdt_usdt_advance',
      label: i18n._(msg`Additional Fee`),
      description: i18n._(msg`Extra fee applied when paying with USDT`),
      value: config.transfer_usdt.usdt_payment.advance_fee_usdt,
      unit: 'USDT',
    },
    {
      id: 'usdt_trx_basic',
      label: i18n._(msg`Basic Fee`),
      description: i18n._(msg`Base fee applied when paying with TRX`),
      value: config.transfer_usdt.trx_payment.basic_fee_usdt,
      unit: 'USDT',
    },
    {
      id: 'usdt_trx_advance',
      label: i18n._(msg`Additional Fee`),
      description: i18n._(msg`Extra fee applied when paying with TRX`),
      value: config.transfer_usdt.trx_payment.advance_fee_usdt,
      unit: 'USDT',
    },
    {
      id: 'trx_usdt_service',
      label: i18n._(msg`Service Fee`),
      description: i18n._(msg`Service charge applied when paying with USDT`),
      value: config.transfer_trx.usdt_payment.service_fee,
      unit: 'TRX',
    },
    {
      id: 'trx_usdt_advance',
      label: i18n._(msg`Additional Fee`),
      description: i18n._(msg`Extra fee applied when paying with USDT`),
      value: config.transfer_trx.usdt_payment.advance_fee,
      unit: 'TRX',
    },
    {
      id: 'trx_trx_fee',
      label: i18n._(msg`Transfer Fee`),
      description: i18n._(msg`Fee charged for TRX-to-TRX transfers`),
      value: config.transfer_trx.trx_payment.fee_trx_amount,
      unit: 'TRX',
    },
  ];
}

function buildPayload(fees: FeeItem[]): ConfigPayloadDto {
  return {
    transfer_usdt: {
      usdt_payment: {
        basic_fee_usdt: get(fees, 'usdt_usdt_basic'),
        advance_fee_usdt: get(fees, 'usdt_usdt_advance'),
      },
      trx_payment: {
        basic_fee_usdt: get(fees, 'usdt_trx_basic'),
        advance_fee_usdt: get(fees, 'usdt_trx_advance'),
      },
    },
    transfer_trx: {
      usdt_payment: {
        service_fee: get(fees, 'trx_usdt_service'),
        advance_fee: get(fees, 'trx_usdt_advance'),
      },
      trx_payment: {
        fee_trx_amount: get(fees, 'trx_trx_fee'),
      },
    },
  };
}

function buildFeeCards(fees: FeeItem[]): FeeCard[] {
  const byId = (id: string) => fees.find((f) => f.id === id)!;
  return [
    {
      title: i18n._(msg`USDT Transfer Fees`),
      description: i18n._(msg`Fee configuration applied when users transfer USDT`),
      sections: [
        {
          groupLabel: i18n._(msg`Pay with USDT`),
          items: [byId('usdt_usdt_basic'), byId('usdt_usdt_advance')],
        },
        {
          groupLabel: i18n._(msg`Pay with TRX`),
          items: [byId('usdt_trx_basic'), byId('usdt_trx_advance')],
        },
      ],
    },
    {
      title: i18n._(msg`TRX Transfer Fees`),
      description: i18n._(msg`Fee configuration applied when users transfer TRX`),
      sections: [
        {
          groupLabel: i18n._(msg`Pay with USDT`),
          items: [byId('trx_usdt_service'), byId('trx_usdt_advance')],
        },
        {
          groupLabel: i18n._(msg`Pay with TRX`),
          items: [byId('trx_trx_fee')],
        },
      ],
    },
  ];
}

const DEFAULT_FEES: FeeItem[] = [
  { id: 'usdt_usdt_basic', label: '', description: '', value: 0, unit: 'USDT' },
  { id: 'usdt_usdt_advance', label: '', description: '', value: 0, unit: 'USDT' },
  { id: 'usdt_trx_basic', label: '', description: '', value: 0, unit: 'USDT' },
  { id: 'usdt_trx_advance', label: '', description: '', value: 0, unit: 'USDT' },
  { id: 'trx_usdt_service', label: '', description: '', value: 0, unit: 'TRX' },
  { id: 'trx_usdt_advance', label: '', description: '', value: 0, unit: 'TRX' },
  { id: 'trx_trx_fee', label: '', description: '', value: 0, unit: 'TRX' },
];

function FeeRow({
  item,
  editingId,
  editValue,
  onEditClick,
  onEditConfirm,
  onEditChange,
  onEditKeyDown,
}: {
  item: FeeItem;
  editingId: string | null;
  editValue: string;
  onEditClick: (item: FeeItem) => void;
  onEditConfirm: () => void;
  onEditChange: (val: string) => void;
  onEditKeyDown: (e: React.KeyboardEvent) => void;
}) {
  const isEditing = editingId === item.id;
  return (
    <div className='flex items-start justify-between gap-4 py-3'>
      <div className='min-w-0 flex-1'>
        <p className='text-sm font-medium'>{item.label}</p>
        <p className='text-muted-foreground text-xs'>{item.description}</p>
      </div>
      <div className='flex shrink-0 items-center gap-2'>
        {isEditing ? (
          <Input
            type='number'
            min={0}
            step={0.01}
            value={editValue}
            onChange={(e) => onEditChange(e.target.value)}
            onBlur={onEditConfirm}
            onKeyDown={onEditKeyDown}
            className='h-8 w-28 text-right'
            autoFocus
          />
        ) : (
          <span className='font-mono text-sm tabular-nums'>
            {item.value} {item.unit}
          </span>
        )}
        <Button
          variant='ghost'
          size='icon'
          className='text-muted-foreground hover:text-foreground size-8 shrink-0'
          onClick={() => (isEditing ? onEditConfirm() : onEditClick(item))}
        >
          <PencilIcon className='size-3.5' />
        </Button>
      </div>
    </div>
  );
}

function TransferFees() {
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
      await updateConfig(buildPayload(fees));
      toast.success(i18n._(msg`Settings saved successfully`));
    } catch {
      toast.error(i18n._(msg`Failed to save settings`));
    }
  }

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className='h-5 w-40' />
              <Skeleton className='h-4 w-64' />
            </CardHeader>
            <CardContent className='flex flex-col gap-2'>
              {[1, 2, 3].map((j) => (
                <Skeleton key={j} className='h-10 w-full' />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError && error) {
    return (
      <Card>
        <CardContent className='text-destructive py-8 text-center text-sm'>{error.message}</CardContent>
      </Card>
    );
  }

  const feeCards = buildFeeCards(fees);

  const rowProps = {
    editingId,
    editValue,
    onEditClick: handleEditClick,
    onEditConfirm: handleEditConfirm,
    onEditChange: setEditValue,
    onEditKeyDown: handleEditKeyDown,
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        {feeCards.map((card) => (
          <Card key={card.title}>
            <CardHeader>
              <CardTitle className='text-base'>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-0 pt-0'>
              {card.sections.map((section, sIdx) => (
                <div key={section.groupLabel}>
                  {sIdx > 0 && <Separator className='my-2' />}
                  <p className='text-muted-foreground mb-1 text-xs font-semibold tracking-wide uppercase'>
                    {section.groupLabel}
                  </p>
                  {section.items.map((item, iIdx) => (
                    <div key={item.id}>
                      {iIdx > 0 && <Separator />}
                      <FeeRow item={item} {...rowProps} />
                    </div>
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className='flex justify-end'>
        <Button onClick={handleSave} disabled={saving || !data?.Config}>
          {saving ? i18n._(msg`Saving...`) : i18n._(msg`Save Settings`)}
        </Button>
      </div>
    </div>
  );
}

export { TransferFees };
