import { HeaderCard } from '@/components/header-card';
import { Card, CardHeader } from '@nexsoft-admin/ui/card';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import { TransferFees } from './_components/transfer-fees';

function SettingPage() {
  return (
    <div className='grid grid-cols-1 gap-4'>
      <Card>
        <CardHeader>
          <HeaderCard
            icon='SettingBoldRadiant'
            title={i18n._(msg`Settings`)}
            description={i18n._(msg`This section provides configuration for all Energy System-related information`)}
          />
        </CardHeader>
      </Card>

      <TransferFees />
    </div>
  );
}

export { SettingPage };
