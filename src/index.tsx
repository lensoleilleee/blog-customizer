import { createRoot } from 'react-dom/client';
import { StrictMode, CSSProperties, useMemo, useState } from 'react';
import clsx from 'clsx';

import { Article } from './components/article/Article';
import { ArticleParamsForm } from './components/article-params-form/ArticleParamsForm';
import {
	defaultArticleState,
	ArticleStateType,
} from './constants/articleProps';

import './styles/index.scss';
import styles from './styles/index.module.scss';

const domNode = document.getElementById('root') as HTMLDivElement;
const root = createRoot(domNode);

const App = () => {
	// фиксируем "как было при открытии страницы"
	const initialState = useMemo<ArticleStateType>(() => defaultArticleState, []);

	// то, что реально применено к статье
	const [appliedState, setAppliedState] =
		useState<ArticleStateType>(initialState);

	// открыть/закрыть панель
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const handleToggleSidebar = () => {
		setIsSidebarOpen((prev) => !prev);
	};

	const handleApply = (nextState: ArticleStateType) => {
		setAppliedState(nextState);
	};

	const handleReset = () => {
		setAppliedState(initialState);
	};

	return (
		<main
			className={clsx(styles.main)}
			style={
				{
					'--font-family': appliedState.fontFamilyOption.value,
					'--font-size': appliedState.fontSizeOption.value,
					'--font-color': appliedState.fontColor.value,
					'--container-width': appliedState.contentWidth.value,
					'--bg-color': appliedState.backgroundColor.value,
				} as CSSProperties
			}>
			<ArticleParamsForm
				value={appliedState}
				initialValue={initialState}
				isSidebarOpen={isSidebarOpen}
				onToggleSidebar={handleToggleSidebar}
				onApply={handleApply}
				onReset={handleReset}
			/>
			<Article />
		</main>
	);
};

root.render(
	<StrictMode>
		<App />
	</StrictMode>
);
