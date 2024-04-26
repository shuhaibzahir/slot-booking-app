import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import moment from 'moment';
import initialData from '../constants/data.json';
import { v4 as uuidv4 } from 'uuid';

export const existingSlots =
	browser && localStorage.getItem('slots')
		? JSON.parse(localStorage.getItem('slots'))
		: initialData;

export const slots = writable(existingSlots);

export const getSlots = () => {
	let slotValue = {};
	const unsubscribe = slots.subscribe((value) => {
		slotValue = value;
	});
	unsubscribe();
	return slotValue;
};
export const setBookingSlots = (
	{ startDate, endDate, vehicleNumber, userEmail, slotId },
	callback
) => {
	try {
		const amountPerMinute = 1;
		const durationInMinutes = moment(endDate).diff(moment(startDate), 'minutes');
		const amountPaid = durationInMinutes * amountPerMinute;
		const newBooking = {
			id: uuidv4(),
			startDate,
			endDate,
			vehicleNumber,
			userEmail,
			amountPaid,
			status: 'upcoming'
		};
		const slotsValue = getSlots();
		const findSlot = slotsValue.find((slot) => slot.id === slotId);
		if (findSlot) {
			findSlot.bookings.push(newBooking);
		}
		localStorage.setItem('slots', JSON.stringify(slotsValue));
		slots.set(slotsValue);
		callback(null, newBooking);
	} catch (error) {
		callback(error, null);
	}
};

export const findBookingSlot = (vehicleNumber) => {
	const currentDate = moment();
	const slotsValue = getSlots();
	let currentData = null;
	for (const slot of slotsValue) {
		const booking = slot.bookings;
		for (const data of booking) {
			if (data.vehicleNumber === vehicleNumber && data.status === 'upcoming') {
				if (
					moment(data.startDate).isSameOrBefore(currentDate) &&
					moment(data.endDate).isAfter(currentDate)
				) {
					currentData = data;
					break;
				}
			}
		}
		if (currentData) {
			break;
		}
	}
	return currentData;
};

export const findBookingForCheckout = (vehicleNumber) => {
	const currentDate = moment();
	const slotValue = getSlots();
	let currentData = null;
	for (const slot of slotValue) {
		if (slot?.bookingDetails?.vehicleNumber === vehicleNumber) {
			currentData = {
				status: slot.status,
				checkInTime: slot.checkInTime,
				...slot.bookingDetails,
				bookingId: slot.bookingDetails.id,
				id: slot.id
			};
			break;
		}
	}
	if (currentData) {
		currentData.Totalamount = currentData.amountPaid;
		currentData.balanceAmount = 0;
		if (currentDate > moment(currentData.bookingDetails?.endDate)) {
			const durationInMinutes = moment(currentDate).diff(
				moment(currentData.bookingDetails?.endDate),
				'minutes'
			);
			const amountPerMinute = 1;
			currentData.balanceAmount = durationInMinutes * amountPerMinute;
			currentData.Totalamount = currentData.balanceAmount + currentData.bookingDetails.amountPaid;
		}
	}

	return currentData;
};

export const setCheckInSlot = (vehicleNumber, callback) => {
	const currentDate = moment();
	const slotsValue = getSlots();
	let currentSlot = null;
	let currentData = null;
	for (const slot of slotsValue) {
		const booking = slot.bookings;
		for (const data of booking) {
			if (data.vehicleNumber === vehicleNumber && data.status === 'upcoming') {
				if (
					moment(data.startDate).isSameOrBefore(currentDate) &&
					moment(data.endDate).isAfter(currentDate)
				) {
					currentData = data;
					break;
				}
			}
		}
		if (currentData) {
			currentSlot = slot;
			break;
		}
	}
	if (!currentData) {
		callback('no data found', null);
		return;
	}
	currentData.status = 'checkedIn';
	currentSlot.status = 'occupied';
	currentSlot.bookingDetails = currentData;
	currentData.checkInTime = currentDate;

	localStorage.setItem('slots', JSON.stringify(slotsValue));
	slots.set(slotsValue);
	callback(null, currentData);
};

export const setCheckout = (slotId, callback = () => {}) => {
	const currentDate = moment();
	const slotValue = getSlots();
    //find current slot
	const currentSlot = slotValue.find((i) => i.id === slotId);
    //keep booking id
	const currentBooking = currentSlot.bookingDetails.id;
    // reset slot
	currentSlot.status = 'available';
	currentSlot.bookingDetails = null;
    //update booking details
	const booking = currentSlot.bookings?.find((i) => i.id === currentBooking);
	booking.status = 'checkedOut';
	booking.checkOutTime = currentDate;

	localStorage.setItem('slots', JSON.stringify(slotValue));
	slots.set(slotValue);

	callback();
};
