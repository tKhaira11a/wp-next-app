
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
