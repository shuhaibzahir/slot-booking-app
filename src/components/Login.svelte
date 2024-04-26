 
  <script>
	import { goto } from '$app/navigation';
	import { setUserLogined } from '../store/userStore.js';
	import { loginUser } from './../service/userService.js';
    let email = '';
    let password = "";
    let error =""

    const onSubmit = () => {
      const userLogined = loginUser({email, password});
      if(userLogined){
        setUserLogined(userLogined);
        goto('/',{replaceState: true});
      }else{
        error ="Invalid Credentials"
      }
    };

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
            <h3 class="text-center">Hi, Please Login</h3>
          </div>
          <div class="card-body">
            <form on:submit|preventDefault={onSubmit}>
              <div class="form-group">
                <label for="username">Enter Email</label>
                <input bind:value={email}  type="text" class="form-control" id="username" placeholder="Enter username">
              </div>
              <div class="form-group mt-3">
                <label for="password">Password</label>
                <input bind:value={password} type="password" class="form-control" id="password" placeholder="Enter password">
              </div>
              <button type="submit" class="mt-3 btn btn-primary btn-block">Login</button>
            </form>
            <div class="mt-2 text-center">
                <a class="btn btn-link" href="/register">Don't have an account, Register?</a>
            </div>


          </div>
        </div>
      </div>
    </div>
  </div>