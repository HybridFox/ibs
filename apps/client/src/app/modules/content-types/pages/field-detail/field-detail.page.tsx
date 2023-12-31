import { useEffect } from 'react';
import {
	IAPIError,
	useContentTypeFieldStore,
	useContentTypeStore,
	useHeaderStore,
} from '@ibs/shared';
import {
	Alert,
	AlertTypes,
	Button,
	ButtonTypes,
	HTMLButtonTypes,
	Header,
	Loading,
} from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { FIELD_DETAIL_TABS, editFieldSchema } from './field-detail.const';

interface IEditFieldForm {
	name: string;
	config: Record<string, unknown>;
	min: number;
	max: number;
	multiLanguage: boolean;
}

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
	const [updateField, updateFieldLoading] = useContentTypeFieldStore(
		(state) => [state.updateField, state.updateFieldLoading]
	);
	const [breadcrumbs] = useHeaderStore((state) => [state.breadcrumbs]);
	const { siteId, contentTypeId, fieldId } = useParams();
	const navigate = useNavigate();
	const formMethods = useForm<IEditFieldForm>({
		resolver: yupResolver(editFieldSchema),
		values: contentTypeField,
	});

	const {
		handleSubmit,
		setError,
		formState: { errors }
	} = formMethods;

	useEffect(() => {
		if (!contentTypeId || !fieldId) {
			return navigate('/not-found');
		}

		fetchContentTypeField(siteId!, contentTypeId, fieldId);
		fetchContentType(siteId!, contentTypeId);
	}, []);

	const onSubmit = (values: IEditFieldForm) => {
		if (!contentType || !contentTypeField) {
			return;
		}

		updateField(siteId!, contentType.id, contentTypeField?.id, values).catch(
			(error: IAPIError) => {
				setError('root', {
					message: error.code,
				});
			}
		);
	};

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
				<FormProvider {...formMethods}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<Alert
							className="u-margin-bottom"
							type={AlertTypes.DANGER}
						>
							{errors?.root?.message}
						</Alert>
						<Outlet />
						<div className="u-margin-top">
							<Button type={ButtonTypes.PRIMARY} htmlType={HTMLButtonTypes.SUBMIT}>
								{updateFieldLoading && (
									<i className="las la-redo-alt la-spin"></i>
								)}{' '}
								Save
							</Button>
						</div>
					</form>
				</FormProvider>
			</Loading>
		</>
	);
};
