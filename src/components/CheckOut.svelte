<script>
	import { getCheckedInDetails, confirmCheckout } from './../store/slotStore.js';

	let vehicleNumber = '';
	let error = '';
	let sucessMessage = '';
	let booking = null;

	$: searchOrClearButtonColor = booking ? 'danger' : 'primary';
	$: searchOrClearButton = booking ? 'Clear' : 'Search';

	const confirmBooking = () => {
		confirmCheckout(booking?.id, (err, result) => {
			if (err) {
				error = err;
			} else {
				clearAllValue();
				setSucessMessage();
			}
		});
	};

	const findDetails = () => {
		if (!vehicleNumber) {
			error = 'Please enter vehicle number';
			return;
		}
		const isBookingExist = getCheckedInDetails(vehicleNumber);
		if (isBookingExist) {
			booking = isBookingExist;
		} else {
			error = 'No booking found';
		}
	};
	const clearAllValue = () => {
		vehicleNumber = '';
		booking = null;
		error = '';
	};

	const setSucessMessage = () => {
		sucessMessage = 'Check-out successfully';
		setTimeout(() => {
			sucessMessage = '';
		}, 5000);
	};
</script>

<div class="container mt-5">
	{#if error}
		<div class="alert alert-danger" role="alert">
			{error}
		</div>
	{/if}
	{#if sucessMessage}
		<div class="alert alert-success" role="alert">
			{sucessMessage}
		</div>
	{/if}
	<div class="row justify-content-center">
		<div class="col-md-6">
			<div class="card">
				<div class="card-header bg-primary text-white text-center p-3">
					<h3 class="text-center">Hi, Check-out here</h3>
				</div>
				<div class="card-body">
					{#if booking}
						<div>
							<p>{booking.startDate}</p>
							<p>{booking.endDate}</p>
							<p>{booking.amountPaid}</p>
							<p>{booking.status}</p>
							<p>{booking.vehicleNumber}</p>
						</div>
					{/if}
					<div class="form-group">
						<input
							bind:value={vehicleNumber}
							type="text"
							class="form-control"
							id="vehicleNumber"
							placeholder="Enter vechicle number"
						/>
					</div>

					<button
						on:click={booking ? clearAllValue : findDetails}
						class={`mt-3 btn btn-${searchOrClearButtonColor} btn-block`}
						>{searchOrClearButton}</button
					>
					{#if booking}
						<button on:click={confirmBooking} class="mt-3 btn btn-primary btn-block">Confirm</button
						>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
