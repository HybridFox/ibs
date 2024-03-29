import { useEffect, useState } from 'react';
import { generatePath, Outlet, useNavigate, useParams } from 'react-router-dom';


import { Header, Loading } from '~components';

import { CONTENT_PATHS } from '../../content.routes';

import { CONTENT_DETAIL_META_TABS, CONTENT_DETAIL_TABS } from './content-detail.const';

import { useContentStore, useContentTypeStore, useHeaderStore, useWorkflowStore } from '~shared';

export const ContentDetailPage = () => {
	const [initialLoading, setInitialLoading] = useState(true);
	const [contentTypeLoading, contentType, fetchContentType] = useContentTypeStore((state) => [
		state.contentTypeLoading,
		state.contentType,
		state.fetchContentType,
	]);
	const [workflowLoading, fetchWorkflow] = useWorkflowStore((state) => [
		state.workflowLoading,
		state.fetchWorkflow,
	]);
	const [contentItem, contentItemLoading, fetchContentItem] = useContentStore((state) => [state.contentItem, state.contentItemLoading, state.fetchContentItem]);
	const [breadcrumbs,] = useHeaderStore((state) => [state.breadcrumbs]);
	const { kind, siteId, contentId } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (!contentId) {
			return;
		}

		fetchContentItem(siteId!, contentId)
			.then((contentItem) => fetchContentType(siteId!, contentItem.contentTypeId))
			.then((contentType) => {
				console.log('check compartments');
				if (contentType.compartments.length) {
					navigate(generatePath(CONTENT_PATHS.DETAIL_COMPARTMENT, {
						contentId,
						kind,
						siteId,
						compartmentId: contentType.compartments[0].id
					}))
				}

				setInitialLoading(false);
				return fetchWorkflow(siteId!, contentType.workflowId);
			})
	}, [contentId]);

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={
					<>
						Edit content <i>"{contentItem?.name || '...'}"</i>
					</>
				}
				tabs={CONTENT_DETAIL_TABS(siteId!, kind, contentItem, contentType)}
				metaTabs={CONTENT_DETAIL_META_TABS(siteId!, kind, contentItem, contentType)}
				metaInfo={contentItem?.language.key.toUpperCase()}
			></Header>
			<div className="u-margin-top">
				<Loading loading={initialLoading || contentItemLoading || contentTypeLoading || workflowLoading} text="Loading data...">
					<Outlet />
				</Loading>
			</div>
		</>
	);
};
