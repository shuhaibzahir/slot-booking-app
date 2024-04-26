<!-- Layout.svelte -->
<script>
    import { user } from '../../store/userStore.js';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
  
    // Check if the user exists on mount
    onMount(() => {
 
      if($user.email){
          goto('/');
      }
    });
  </script>
  
  {#if !$user.email}
    <!-- Render the home route if the user is authenticated -->
    <slot />
   {/if}
  