<!-- Layout.svelte -->
<script>
    import {  user } from '../../../store/userStore.js';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
  
    // Check if the user exists on mount
    onMount(() => {
      if(!$user.isAdmin){
          goto('/');
      }
    });
 
  </script>
  
  {#if $user.isAdmin}
    <slot />
   {/if}
  