import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import cx from 'classnames/bind';
import { Tooltip } from 'react-tooltip'

import { ITextareaFieldProps } from './textarea-field.types';
import styles from './textarea-field.module.scss';

const cxBind = cx.bind(styles);

export const TextareaField: FC<ITextareaFieldProps> = ({
	name,
	label,
	placeholder,
	fieldOptions,
}: ITextareaFieldProps) => {
	const { register, formState: { errors } } = useFormContext();
	const error = errors?.[name]

	return (
		<div className={cxBind('a-input', {
			'a-input--has-error': !!error
		})}>
			{label && (
				<label htmlFor={name} className={cxBind('a-input__label')}>
					{label}
				</label>
			)}
			<div className={cxBind('a-input__field-wrapper')}>
				<textarea
					className={cxBind('a-input__field')}
					placeholder={placeholder}
					{...register(name, {
						...fieldOptions,
					})}
				/>
				{error && (
					<>
						<Tooltip anchorSelect={`#${name}-err-tooltip`}>
							{error.message?.toString()}
						</Tooltip>
						<div className={cxBind('a-input__error')} id={`${name}-err-tooltip`}>
							<i className="las la-exclamation-triangle"></i>
						</div>
					</>
				)}
			</div>
		</div>
	);
};
