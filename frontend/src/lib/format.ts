const dkk = new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK' });
const day = new Intl.DateTimeFormat('da-DK', {
	weekday: 'short',
	day: 'numeric',
	month: 'short',
	timeZone: 'Europe/Copenhagen'
});

export const formatPrice = (amount: number): string => dkk.format(amount);

export const formatDate = (iso: string): string => day.format(new Date(iso));

/** "Fra søn. 4. okt." for upcoming offers, otherwise "Til lør. 10. okt.". */
export const formatValidity = (validFrom: string, validUntil: string, now = new Date()): string =>
	new Date(validFrom) > now ? `Fra ${formatDate(validFrom)}` : `Til ${formatDate(validUntil)}`;
