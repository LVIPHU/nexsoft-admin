import { HeaderCard } from '@/components/header-card';
import { Card, CardHeader } from '@nexsoft-admin/ui/card';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';

function SettingPage() {
  return (
    <div className='grid grid-cols-1 gap-4'>
      <Card>
        <CardHeader>
          <HeaderCard
            icon='SettingBoldRadiant'
            title={i18n._(msg`Resource Summary`)}
            description={i18n._(msg`This section provides configuration for all Energy System-related information`)}
          />
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>

        </CardHeader>
      </Card>
    </div>
  )
}

export { SettingPage };
