
/*
 *  Copyright (C) 2026 Tarik Khairalla (khairalla-code)
 *   https://khairalla-code.com | https://github.com/tKhaira11a/wp-next-app-complete-.git
 *
 *  This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 */

import { useEffect, useState } from '@wordpress/element';

/**
 * Custom Hook für die Synchronisation von Gutenberg Blocks mit Custom Post Types
 *
 * @param {string} clientId - Die Block-Client-ID
 * @param {Object} attributes - Die Block-Attribute
 * @param {Function} setAttributes - Funktion zum Setzen der Attribute
 * @param {Array} watchedAttributes - Array der zu überwachenden Attribut-Namen
 * @param {Array} externalDependencies - Array von externen Werten (z.B. innerBlocks), die auch überwacht werden sollen
 * @param {Function} createCallback - Callback-Funktion zum Erstellen des CPT-Eintrags
 * @param {Function} updateCallback - Callback-Funktion zum Aktualisieren des CPT-Eintrags
 * @param {number} debounceDelay - Verzögerung in ms vor dem Update (default: 3000)
 */
export const useCptSync = ({
							   clientId,
							   attributes,
							   setAttributes,
							   watchedAttributes = [],
							   externalDependencies = [],
							   createCallback,
							   updateCallback,
							   debounceDelay = 3000
						   }) => {
	const { instanceId, cptId } = attributes;
	const [hasCreatedCPT, setHasCreatedCPT] = useState(false);

	// Synchronisiere instanceId mit clientId
	useEffect(() => {
		if (instanceId !== clientId) {
			setAttributes({
				instanceId: clientId
			});
			setHasCreatedCPT(false);
		}
	}, [instanceId, clientId, setAttributes]);

	// Erstelle CPT-Eintrag, wenn noch nicht erstellt
	useEffect(() => {
		if (!hasCreatedCPT && createCallback) {
			createCallback().then(() => {
				setHasCreatedCPT(true);
			}).catch((error) => {
				console.error('Failed to create CPT entry:', error);
			});
		}
	}, [hasCreatedCPT, createCallback]);

	// Update CPT-Eintrag bei Änderungen (mit Debounce)
	useEffect(() => {
		if (!cptId || !hasCreatedCPT || !updateCallback) return;

		const updateTimeout = setTimeout(() => {
			updateCallback();
		}, debounceDelay);

		return () => clearTimeout(updateTimeout);
	}, [
		cptId,
		hasCreatedCPT,
		updateCallback,
		debounceDelay,
		...watchedAttributes.map(attr => attributes[attr]),
		...externalDependencies
	]);

	return {
		hasCreatedCPT,
		setHasCreatedCPT
	};
};
