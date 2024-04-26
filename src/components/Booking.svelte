<script>
	import { Modal } from '@sveltestrap/sveltestrap';
	import { setBookingSlots } from '../store/slotStore';
	import { user } from '../store/userStore';

	export let open = false;
	export let toggle = () => {};
	export let clearAllValue = () => {};
	export let bookingData = {};
	export let setSucessMessage = () =>{}
	export let slot = null;
	let error = '';
	let vehicleNumber = '';
	const onSubmit = () => {
		if (!vehicleNumber || !slot?.id) {
			error = 'Need required data';
		}
		const data = {
			startDate: bookingData.startDate,
			endDate: bookingData.endDate,
			vehicleNumber,
			slotId: slot?.id,
			userEmail: $user.email
		};

		setBookingSlots(data, (err, result) => {
			if (err) {
				error = err;
			} else {
				setSucessMessage()
				toggle();
				clearAllValue();
				vehicleNumber = '';
				error = '';
			}
		});
	};
</script>

<div>
	<Modal body header="Booking your slot..." isOpen={open} {toggle}>
		<form on:submit|preventDefault={onSubmit}>
			<div class="form-group">
				<label for="username">Enter Vehicle Number</label>
				<input
					bind:value={vehicleNumber}
					type="text"
					class="form-control"
					id="vehicleNumber"
					placeholder="Enter vehicle number"
				/>
			</div>

			<button type="submit" class="mt-3 btn btn-primary btn-block">Confirm</button>
		</form>
		{#if error}
			<div class="container mt-3 alert alert-danger" role="alert">
				{error}
			</div>
		{/if}
	</Modal>
</div>
