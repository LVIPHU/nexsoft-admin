import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@nexsoft-admin/ui/select';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';

const TOPICS = [
  { value: 'Spam_Or_Scam', label: msg`Spam / Scam` },
  { value: 'Harassment_Or_Bullying', label: msg`Harassment / Bullying` },
  { value: 'HateSpeech_Or_Discrimination', label: msg`Hate Speech / Discrimination` },
  { value: 'Nudity_Or_Sexual_Content', label: msg`Nudity / Sexual Content` },
  { value: 'Violence_Or_Harmful_Content', label: msg`Violence / Harmful Content` },
];

interface ModerationKeywordsFilterProps {
  topic: string;
  onTopicChange: (topic: string) => void;
}

function ModerationKeywordsFilter({ topic, onTopicChange }: ModerationKeywordsFilterProps) {
  return (
    <Select value={topic || 'ALL'} onValueChange={(val) => onTopicChange(val === 'ALL' ? '' : val)}>
      <SelectTrigger className='w-52'>
        <SelectValue placeholder={i18n._(msg`All Topics`)} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='ALL'>{i18n._(msg`All Topics`)}</SelectItem>
        {TOPICS.map((t) => (
          <SelectItem key={t.value} value={t.value}>
            {i18n._(t.label)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export { ModerationKeywordsFilter, TOPICS };
