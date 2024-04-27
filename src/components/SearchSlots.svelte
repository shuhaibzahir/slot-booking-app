<script>
	import { getFreeSlots } from '../store/slotStore.js';
	import moment from 'moment';
 	import Booking from './Booking.svelte';

	let vehicleType = '';
	let startDate = '';
	let endDate = '';
	let slot = null;
	let error = '';
	let sucessMessage =""
	let bookingModalOpen = false;

	// Set minimum values for start date and end date
	$: minStartDate = moment().format('YYYY-MM-DDTHH:mm');
	$: minEndDate = moment(startDate).format('YYYY-MM-DDTHH:mm');

	const searchSlots = () => {
		error = '';
		slot = null;
		if (!vehicleType || !startDate || !endDate) {
			error = 'Please select vehicle type, start date and end date';
			return;
		}
		const freeSlot = getFreeSlots(vehicleType, startDate, endDate);
		if (freeSlot) {
			slot = freeSlot;
		} else {
			error = 'No slot available!';
		}
	};

	const toggleBookingModal = () => {
		bookingModalOpen = !bookingModalOpen;
	};

	const clearAllValue = () => {
		vehicleType = '';
		startDate = '';
		endDate = '';
		error = '';
		slot = null;
	};

	const setSucessMessage = ()=>{
		sucessMessage = 'Booking successfully completed';
		setTimeout(() => {
			sucessMessage = '';
		}, 5000);
	};
	
</script>

<div class="container mt-5 d-flex flex-column align-items-center justify-content-center">
	{#if sucessMessage}
	<div class="container my-3 alert alert-success" role="alert">
		{sucessMessage}
	</div>
{/if}

	<div class="card" style="width: 500px;">
		<div class="row flex-column card-body">
			<h5 class="card-title">Search Slot</h5>

			<div class="mb-3">
				<label class="form-label" for="vehicleType">Vehicle Type:</label>
				<select id="vehicleType" class="form-select" bind:value={vehicleType}>
					<option value="">Select</option>
					<option value="fourwheeler">Car</option>
					<option value="twowheeler">Bike</option>
				</select>
			</div>

			<div class="mb-3">
				<label class="form-label" for="startDate">Start Date:</label>
				<input
					id="startDate"
					type="datetime-local"
					class="form-control"
					bind:value={startDate}
					min={minStartDate}
				/>
			</div>

			<div class="mb-3">
				<label class="form-label" for="endDate">End Date:</label>
				<input
					id="endDate"
					type="datetime-local"
					class="form-control"
					bind:value={endDate}
					min={minEndDate}
				/>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12 mt-3 text-center">
			<button class="btn btn-primary" on:click={searchSlots}>Search</button>
		</div>
	</div>
</div>
<Booking
	open={bookingModalOpen}
	{slot}
	{setSucessMessage}
	bookingData={{ startDate, endDate }}
	{clearAllValue}
	toggle={toggleBookingModal}
/>

{#if slot}
	<div class=" container mt-3 alert alert-primary" role="alert">
		Free slots are available! <button class="btn btn-link" on:click={toggleBookingModal}
			>Book Here</button
		>
	</div>
{/if}

{#if error}
	<div class="container mt-3 alert alert-danger" role="alert">
		{error}
	</div>
{/if}
