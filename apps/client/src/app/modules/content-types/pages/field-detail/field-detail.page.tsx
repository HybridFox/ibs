import { useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import {
	Header,
	Loading,
} from '~components';

import { FIELD_DETAIL_TABS } from './field-detail.const';

import {
	useContentTypeFieldStore,
	useContentTypeStore,
	useHeaderStore,
} from '~shared';

export const FieldDetailPage = () => {
	const [contentType, contentTypeLoading, fetchContentType] =
		useContentTypeStore((state) => [
			state.contentType,
			state.contentTypeLoading,
			state.fetchContentType,
		]);
	const [contentTypeField, contentTypeFieldLoading, fetchContentTypeField] =
		useContentTypeFieldStore((state) => [
			state.field,
			state.fieldLoading,
			state.fetchField,
		]);
	const [breadcrumbs] = useHeaderStore((state) => [state.breadcrumbs]);
	const { siteId, contentTypeId, fieldId } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (!contentTypeId || !fieldId) {
			return navigate('/not-found');
		}

		fetchContentTypeField(siteId!, contentTypeId, fieldId);
		fetchContentType(siteId!, contentTypeId);
	}, []);

	return (
		<>
			<Header
				title={
					<>
						Editing field <i>"{contentTypeField?.name || '...'}"</i>
					</>
				}
				tabs={FIELD_DETAIL_TABS(siteId!, contentType, contentTypeField)}
				breadcrumbs={breadcrumbs}
			></Header>
			<Loading
				text="Content type loading..."
				loading={contentTypeLoading || contentTypeFieldLoading}
			>
				<Outlet />
			</Loading>
		</>
	);
};
