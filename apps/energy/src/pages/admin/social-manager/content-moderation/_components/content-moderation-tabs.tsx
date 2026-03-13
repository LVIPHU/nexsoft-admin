import { useSearchParams } from 'react-router';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@nexsoft-admin/ui/tabs';
import { Card, CardContent } from '@nexsoft-admin/ui/card';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import { HighPriorityTable } from './high-priority-table';
import { WarningsTable } from './warnings-table';
import { AllContentTable } from './all-content-table';

const TAB_PARAM = 't';
const TABS = {
  HIGH_PRIORITY: 'high-priority',
  WARNINGS: 'warnings',
  ALL: 'all',
} as const;

function ContentModerationTabs() {
  const [params, setParams] = useSearchParams();
  const activeTab = params.get(TAB_PARAM) ?? TABS.HIGH_PRIORITY;

  const handleTabChange = (value: string) => {
    setParams((prev) => {
      prev.set(TAB_PARAM, value);
      return prev;
    });
  };

  return (
    <Card>
      <CardContent className='pt-6'>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className='mb-4'>
            <TabsTrigger value={TABS.HIGH_PRIORITY}>{i18n._(msg`High Priority`)}</TabsTrigger>
            <TabsTrigger value={TABS.WARNINGS}>{i18n._(msg`Warnings`)}</TabsTrigger>
            <TabsTrigger value={TABS.ALL}>{i18n._(msg`All Content`)}</TabsTrigger>
          </TabsList>
          <TabsContent value={TABS.HIGH_PRIORITY}>
            <HighPriorityTable />
          </TabsContent>
          <TabsContent value={TABS.WARNINGS}>
            <WarningsTable />
          </TabsContent>
          <TabsContent value={TABS.ALL}>
            <AllContentTable />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export { ContentModerationTabs };
