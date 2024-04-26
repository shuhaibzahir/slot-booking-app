import moment from 'moment';

export const findFreeSlots = (slots, type, fromDate, toDate)  => {
    // Filter slots by type
    const filteredSlots = slots.filter(slot => slot.type === type);

    // Loop through filtered slots
    for (const slot of filteredSlots) {
        // Check each booking
        let isFree = true;
        for (const booking of slot.bookings) {
            const bookingFromDate = moment(booking.fromDate);
            const bookingToDate = moment(booking.toDate);
            const queryFromDate = moment(fromDate);
            const queryToDate = moment(toDate);

            // Check if the time period overlaps with any booking
            if (queryFromDate.isBefore(bookingToDate) && queryToDate.isAfter(bookingFromDate)) {
                isFree = false;
                break; // No need to check further bookings for this slot
            }
        }

        // If no booking overlaps with the queried time period, return the slot
        if (isFree) {
            return slot;
        }
    }

    // If no free slot is found, return null
    return null;
}
