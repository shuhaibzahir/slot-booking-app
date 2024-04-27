 
  <script>
	import { setUserLogined } from './../store/userStore.js';
	import { onDestroy } from 'svelte';
	import { registerUser } from './../service/userService.js';
	import { goto } from '$app/navigation';
    let email = '';
    let password = "";
    let name = "";
    let error = ""
    const onSubmit = () => {
        error=""
      registerUser({email, password, name}).then((result)=>{
        setUserLogined(result);
        goto('/',{replaceState: true});
        }).catch((err)=>{
        error = err;
      })
    };

    onDestroy(()=>{
        error=""
        email = "";
        password = "";
        name = "";
    })

  </script>

  <div class="container mt-5">
    {#if error}
    <div class="alert alert-danger" role="alert">
       {error}
      </div>
    {/if}
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-success text-white text-center p-3">
            <h3 class="text-center">Hi, Please register your account </h3>
          </div>
          <div class="card-body">
            <form on:submit|preventDefault={onSubmit}>
                <div class="form-group">
                    <label for="name">Enter Name</label>
                    <input bind:value={name}  type="text" class="form-control" id="name" placeholder="Enter name">
                  </div>
              <div class="form-group mt-3">
                <label for="username">Enter Email</label>
                <input bind:value={email}  type="email" class="form-control" id="email" placeholder="Enter email">
              </div>
              <div class="form-group mt-3">
                <label for="password">Password</label>
                <input bind:value={password} type="password" class="form-control" id="password" placeholder="Enter password">
              </div>
              <button type="submit" class="mt-3 btn btn-primary btn-block">Login</button>
            </form>
          </div>
          <div class="mt-2 text-center">
            <a class="btn btn-link" href="/login">Already have an account?</a>
        </div>
        </div>
      </div>
    </div>
  </div>