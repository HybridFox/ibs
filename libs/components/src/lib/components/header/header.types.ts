import { IHeaderBreadcrumb } from "@ibs/shared";
import { ReactNode } from "react";

export interface IHeaderTab {
	to: string;
	label: ReactNode;
	disabled?: boolean;
}

export interface IHeaderProps {
	title: ReactNode;
	action?: ReactNode;
	className?: string;
	tabs?: IHeaderTab[];
	breadcrumbs?: IHeaderBreadcrumb[];
	metaInfo?: string;
	subText?: ReactNode;
}
