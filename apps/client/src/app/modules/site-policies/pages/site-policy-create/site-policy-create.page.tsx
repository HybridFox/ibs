import {
	IAPIError,
	PERMISSION_EFFECT,
	useHeaderStore,
	useIAMActionStore,
	useSitePolicyStore,
} from '@ibs/shared';
import { useEffect } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { TextField } from '@ibs/forms';
import { useTranslation } from 'react-i18next';
import { Alert, AlertTypes, Button, HTMLButtonTypes, Header, Loading } from '@ibs/components';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { SITE_POLICY_PATHS } from '../../site-policies.routes';
import { PermissionManager } from '../../../policies/components/permission-manager';

import { createPolicySchema } from './site-policy-create.const';

interface CreatePolicyForm {
	name: string;
	permissions: {
		effect: PERMISSION_EFFECT,
		resources: string[];
		actions: string[];
	}[]
}

export const SitePolicyCreatePage = () => {
	const [createPolicy, createPolicyLoading] = useSitePolicyStore((state) => [
		state.createPolicy,
		state.createPolicyLoading,
	]);
	const [iamActions, iamActionsLoading, fetchIAMActions] = useIAMActionStore((state) => [
		state.iamActions,
		state.iamActionsLoading,
		state.fetchIAMActions,
	])
	const { siteId } = useParams();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [breadcrumbs, setBreadcrumbs] = useHeaderStore((state) => [state.breadcrumbs, state.setBreadcrumbs]);
	const formMethods = useForm<CreatePolicyForm>({
		resolver: yupResolver(createPolicySchema)
	});

	const {
		handleSubmit,
		formState: { errors },
		setError,
	} = formMethods;

	useEffect(() => {
		fetchIAMActions();
		setBreadcrumbs([
			{ label: t(`BREADCRUMBS.SITE_POLICIES`), to: SITE_POLICY_PATHS.ROOT },
			{ label: t(`BREADCRUMBS.CREATE`) },
		]);
	}, []);

	const onSubmit = (values: CreatePolicyForm) => {
		createPolicy(siteId!, values)
			.then((policy) => navigate(generatePath(SITE_POLICY_PATHS.DETAIL, { siteId, policyId: policy.id })))
			.catch((error: IAPIError) => {
				setError('root', {
					message: error.code,
				});
			});
	};

	return (
		<>
			<Header
				breadcrumbs={breadcrumbs}
				title={t('SITE_POLICIES.TITLES.CREATE')}
			></Header>
			<div className="u-margin-top">
				<Loading loading={iamActionsLoading}>
					<FormProvider {...formMethods}>
						<Alert className="u-margin-bottom" type={AlertTypes.DANGER}>
							{errors?.root?.message}
						</Alert>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="u-margin-bottom">
								<TextField name="name" label="Name" />
							</div>
							<PermissionManager name="permissions" iamActions={iamActions} />
							<Button htmlType={HTMLButtonTypes.SUBMIT}>
								{createPolicyLoading && <i className="las la-redo-alt la-spin"></i>} Save
							</Button>
						</form>
					</FormProvider>
				</Loading>
			</div>
		</>
	);
};