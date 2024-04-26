<!-- Layout.svelte -->
<script>
  import { setUserLoggedOut, user } from '../../store/userStore.js';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  // Check if the user exists on mount
  onMount(() => {
    if(!$user.email){
        goto('/login');
    }
  });
  const onLogout = () => {
    setUserLoggedOut();
    goto('/login',{replaceState: true});
  };
</script>

{#if $user.email}
<nav class="navbar navbar-expand-lg bg-body-tertiary ">
  <div class="container-fluid d-flex justify-content-between w-100">
    <a class="navbar-brand" href="/">Slot Booking</a>
 
    <div class="collapse navbar-collapse" id="navbarNav">
      <li class="nav-item">
        <a class="btn btn-outline-primary mx-3" href="/">Find Slot</a>
      </li>
      {#if $user.isAdmin}
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="btn btn-outline-primary" aria-current="page" href="/check-in">check-in</a>
        </li>
        <li class="nav-item">
          <a class="btn btn-outline-primary ms-3" href="/check-out">check-out</a>
        </li>
      </ul>
      {/if}
     
    </div>
    <button class="btn btn-outline-primary flex-end" type="button" on:click={onLogout}>Logout</button>  
  </div>
</nav>
  <!-- Render the home route if the user is authenticated -->
  <slot />
 {/if}
