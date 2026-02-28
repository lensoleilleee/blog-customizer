import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';

import {
	ArticleStateType,
	backgroundColors,
	contentWidthArr,
	fontColors,
	fontFamilyOptions,
	fontSizeOptions,
} from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

interface ArticleParamsFormProps {
	value: ArticleStateType; // применённые значения (что сейчас в статье)
	initialValue: ArticleStateType; // значения на момент открытия страницы

	isSidebarOpen: boolean;
	onToggleSidebar: () => void;

	onApply: (value: ArticleStateType) => void;
	onReset: () => void;
}

export const ArticleParamsForm: React.FC<ArticleParamsFormProps> = ({
	value,
	initialValue,
	isSidebarOpen,
	onToggleSidebar,
	onApply,
	onReset,
}) => {
	const [formState, setFormState] = useState<ArticleStateType>(value);

	useEffect(() => {
		setFormState(value);
	}, [value]);

	const wrapperRef = useRef<HTMLDivElement>(null);

	// закрытие по клику вне
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (!isSidebarOpen) return;

			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(event.target as Node)
			) {
				onToggleSidebar();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isSidebarOpen, onToggleSidebar]);

	const handleApply = (e: React.FormEvent) => {
		e.preventDefault();
		onApply(formState);
	};

	const handleReset = () => {
		setFormState(initialValue);
		onReset();
	};

	// helpers чтобы не дублировать setFormState
	const setOption =
		<K extends keyof ArticleStateType>(key: K) =>
		(option: ArticleStateType[K]) => {
			setFormState((prev) => ({
				...prev,
				[key]: option,
			}));
		};

	return (
		<div ref={wrapperRef}>
			<ArrowButton isOpen={isSidebarOpen} onClick={onToggleSidebar} />
			<aside
				className={clsx(
					styles.container,
					isSidebarOpen && styles.container_open
				)}>
				<form className={styles.form} onSubmit={handleApply}>
					<Text as='h2' size={31} weight={800} uppercase>
						Задайте параметры
					</Text>
					{/* Шрифт */}
					<Select
						title='Шрифт'
						selected={formState.fontFamilyOption}
						options={fontFamilyOptions}
						onChange={setOption('fontFamilyOption')}
					/>

					{/* Размер шрифта */}
					<RadioGroup
						title='Размер шрифта'
						name='fontSize'
						selected={formState.fontSizeOption}
						options={fontSizeOptions}
						onChange={setOption('fontSizeOption')}
					/>

					{/* Цвет шрифта */}
					<Select
						title='Цвет шрифта'
						selected={formState.fontColor}
						options={fontColors}
						onChange={setOption('fontColor')}
					/>

					<div className={styles.sepWrap}>
						<Separator />
					</div>

					{/* Цвет фона */}
					<Select
						title='Цвет фона'
						selected={formState.backgroundColor}
						options={backgroundColors}
						onChange={setOption('backgroundColor')}
					/>

					{/* Ширина контента */}
					<Select
						title='Ширина контента'
						selected={formState.contentWidth}
						options={contentWidthArr}
						onChange={setOption('contentWidth')}
					/>

					<div className={styles.bottomContainer}>
						<Button
							title='Сбросить'
							htmlType='button'
							type='clear'
							onClick={handleReset}
						/>
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</div>
	);
};
