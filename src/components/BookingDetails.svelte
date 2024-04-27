<script>
	import moment from "moment";

    export let booking= null;
</script>

{#if booking}
<div>
 <p class="text-success">From: {moment(booking.startDate).format("YYYY-MM-DD hh:mm A")}</p>
 <p class="text-danger">To : {moment(booking.endDate).format("YYYY-MM-DD hh:mm A")}</p>
 <p>Current Status: <span class="p-2 bg-warning text-white">{booking.status}</span></p>
 <p>Vehicle Number: {booking.vehicleNumber}</p>
 <div class="alert alert-info" role="alert">
    <p>Amount Paid : $ {booking.amountPaid}</p>
    {#if booking.balanceAmount}
    <p>Balance amount : $ {booking.balanceAmount}</p>
    {/if}
   {#if booking.totalAmount}
   <p>Total Amount : $ {booking.totalAmount}</p>
   {/if}
 </div>
</div>
{/if}