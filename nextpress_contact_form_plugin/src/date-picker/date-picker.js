import { useState, useRef } from '@wordpress/element';
import { TextControl, Popover, DatePicker } from '@wordpress/components';

export const DatePickerInput = ({ currentDate, onChange, label }) => {
	const [isOpen, setIsOpen] = useState(false);
	const inputRef = useRef();
	const formatDate = (date) => {
		if (!date) return "";
		return new Intl.DateTimeFormat('de-DE', {
			weekday: 'short', // Di
			day: '2-digit',   // 26
			month: 'short',   // Jun
			year: 'numeric'   // 2025
		}).format(date);
	};
	return (
		<div>
			<TextControl
				ref={inputRef}
				label={label}
				value={formatDate(currentDate)}
				onClick={() => setIsOpen(true)}
				readOnly
			/>

			{isOpen && (
				<Popover
					anchorRef={inputRef}
					onClose={() => setIsOpen(false)}
					focusOnMount={false}
				>
					<DatePicker
						currentDate={currentDate}
						onChange={(newDate) => {
							onChange(newDate);
							setIsOpen(false);
						}}
						is12Hour={false}
					/>
				</Popover>
			)}
		</div>
	);
};
