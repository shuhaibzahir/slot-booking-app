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

export const getcurrentState = () => {
	let currentState = {};
	const unsubscribe = slots.subscribe((value) => {
		currentState = value;
	});
	unsubscribe();
	return currentState;
};

export const bookingConfirmation = (
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
// save new booking
		const slotsValue = getcurrentState();
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

export const getFreeSlots = ( type, fromDate, toDate)  => {
	const slotsValue = getcurrentState();
    const filteredSlots = slotsValue.filter(slot => slot.type === type);
    for (const slot of filteredSlots) {
        // Check each booking
        let isFree = true;
		//TODO if the slot has booking details and the fromDate is between the booking fromDate and toDate, then the slot is not free 
        for (const booking of slot.bookings) {
            const bookingFromDate = moment(booking.fromDate);
            const bookingToDate = moment(booking.toDate);
            const queryFromDate = moment(fromDate);
            const queryToDate = moment(toDate);

            if (queryFromDate.isBefore(bookingToDate) && queryToDate.isAfter(bookingFromDate)) {
                isFree = false;
                break; 
            }
        }

        // If no booking overlaps with the queried time period, return the slot
        if (isFree) {
            return slot;
        }
    }
    return null;
}


export const findBookedSlot = (vehicleNumber) => {
	const currentDate = moment();
	const slotsValue = getcurrentState();
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

export const getCheckedInDetails = (vehicleNumber) => {
	const currentDate = moment();
	const slotValue = getcurrentState();
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
		currentData.totalAmount = currentData.amountPaid;
		currentData.balanceAmount = 0;
		const endDate = moment(currentData?.endDate)
		if (currentDate.isAfter(endDate)) {
			console.log("hitted")
			const durationInMinutes = moment(currentDate).diff(endDate,'minutes');
			const amountPerMinute = 1;
			currentData.balanceAmount = durationInMinutes * amountPerMinute;
			currentData.totalAmount = currentData.balanceAmount + currentData.amountPaid;
		}
	}

	return currentData;
};

export const confirmCheckIn = (vehicleNumber, callback) => {
	const currentDate = moment();
	const slotsValue = getcurrentState();
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

export const confirmCheckout = (slotId, callback = () => {}) => {
	const currentDate = moment();
	const slotValue = getcurrentState();
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
