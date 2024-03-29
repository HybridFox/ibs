import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useParams } from 'react-router-dom';

import { CONTENT_PATHS } from '../../content.routes';
import { useWorkflowStateStore } from '../../../workflow/stores/workflow-state';
import { ContentForm, ContentFormMode } from '../../components';

import {
	CONTENT_TYPE_KINDS_TRANSLATIONS,
	IContentItem,
	useContentStore,
	useContentTypeStore,
	useHeaderStore,
	useWorkflowStore,
} from '~shared';

export const ContentDetailCompartmentPage = () => {
	const [workflowStates, fetchWorkflowStates] = useWorkflowStateStore((state) => [state.workflowStates, state.fetchWorkflowStates]);
	const [contentType] = useContentTypeStore((state) => [state.contentType]);
	const [updateContentItem, updateContentItemLoading] = useContentStore((state) => [state.updateContentItem, state.updateContentItemLoading]);
	const [contentItem] = useContentStore((state) => [state.contentItem]);
	const [workflow] = useWorkflowStore((state) => [state.workflow]);
	const { t } = useTranslation();
	const { siteId, compartmentId, kind } = useParams();
	const [setBreadcrumbs] = useHeaderStore((state) => [state.setBreadcrumbs]);

	useEffect(() => {
		fetchWorkflowStates(siteId!, { pagesize: -1 });
	}, []);

	useEffect(() => {
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.${kind?.toUpperCase()}`), to: generatePath(CONTENT_PATHS.ROOT, { siteId, kind }) },
			{
				label: contentType?.name,
				badge: contentType && CONTENT_TYPE_KINDS_TRANSLATIONS[contentType.kind],
			},
			{ label: 'Fields' },
		]);
	}, [contentItem, contentType]);

	const handleSubmit = (values: IContentItem) => {
		if (!contentItem) {
			return;
		}

		updateContentItem(siteId!, contentItem.id, values);
	};

	return (
		<ContentForm
			onSubmit={handleSubmit}
			mode={ContentFormMode.EDIT}
			contentItem={contentItem}
			workflow={workflow}
			workflowStates={workflowStates}
			loading={updateContentItemLoading}
			fields={(contentType?.fields || []).filter((field) => field.compartmentId === compartmentId)}
		/>
	);
};
