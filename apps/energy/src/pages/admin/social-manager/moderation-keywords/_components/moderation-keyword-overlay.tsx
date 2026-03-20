import { OverlayItem } from '@/types/overlay.type';
import { Overlay } from '@/components/overlay';
import { Form, FormGenerator, type FieldConfig } from '@nexsoft-admin/ui';
import { useModerationLanguages, useSaveModerationKeyword } from '@/services/content-moderation';
import { saveModerationKeywordSchema, type SaveModerationKeywordPayload } from '@nexsoft-admin/models';
import { toast } from 'sonner';
import { t } from '@lingui/core/macro';
import { useMemo } from 'react';
import { i18n } from '@lingui/core';
import { TOPICS } from './moderation-keywords-filter';

function ModerationKeywordOverlay({ isTop, mode, props, ...rest }: OverlayItem & { isTop: boolean }) {
  const { data: languagesData, loading: languagesLoading } = useModerationLanguages();
  const { saveModerationKeyword } = useSaveModerationKeyword();

  const languageOptions = useMemo(
    () =>
      languagesData?.data.map((lang) => ({
        label: `${lang.text} (${lang.lang_code})`,
        value: lang.lang_code,
      })) ?? [],
    [languagesData],
  );

  const topicOptions = useMemo(
    () =>
      TOPICS.map((topic) => ({
        label: i18n._(topic.label),
        value: topic.value,
      })),
    [],
  );

  const fieldConfigs: FieldConfig[] = useMemo(
    () => [
      {
        name: 'keyword',
        label: t`Keyword`,
        placeholder: t`Enter keyword`,
        orientation: 'vertical',
        required: true,
      },
      {
        name: 'lang_code',
        type: 'select' as const,
        label: t`Language`,
        placeholder: t`Select language`,
        orientation: 'vertical',
        required: true,
        options: languageOptions,
        searchable: true,
      },
      {
        name: 'topics',
        type: 'multi-select' as const,
        label: t`Topics`,
        placeholder: t`Select topics`,
        orientation: 'vertical',
        required: true,
        options: topicOptions,
      },
      {
        name: 'is_active',
        type: 'switch' as const,
        label: t`Active`,
        orientation: 'horizontal',
      },
    ],
    [languageOptions, topicOptions],
  );

  const resetValues = useMemo(() => {
    if (mode === 'create') return { is_active: true, topics: [] };
    return {
      keyword: props?.keyword ?? '',
      lang_code: props?.lang_code ?? '',
      topics: props?.topics ?? [],
      is_active: props?.is_active ?? true,
    };
  }, [mode, props]);

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      const payload: SaveModerationKeywordPayload = {
        keyword: data.keyword as string,
        lang_code: data.lang_code as string,
        topics: data.topics as string[],
        is_active: data.is_active as boolean,
        ...(mode === 'update' && props?.id ? { id: props.id as number } : {}),
      };
      await saveModerationKeyword(payload);

      if (rest.onSubmit) {
        await rest.onSubmit(mode);
      }

      toast.success(mode === 'create' ? t`Keyword created successfully` : t`Keyword updated successfully`);
    } catch (error) {
      console.error('Error submitting keyword:', error);
      toast.error(mode === 'create' ? t`Failed to create keyword` : t`Failed to update keyword`);
      throw error;
    }
  };

  return (
    <Overlay isTop={isTop} mode={mode} {...rest}>
      <Form
        schema={saveModerationKeywordSchema}
        resetValues={resetValues}
        fieldConfigs={fieldConfigs}
        onSubmit={handleSubmit}
      >
        <FormGenerator loading={languagesLoading} schema={saveModerationKeywordSchema} fieldConfigs={fieldConfigs} />
      </Form>
    </Overlay>
  );
}

export { ModerationKeywordOverlay };
