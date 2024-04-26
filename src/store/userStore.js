import { writable } from 'svelte/store';
import { browser } from "$app/environment"

export const existingUser = browser && localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {};

 
export const user = writable(existingUser);

export const setUserLogined = (userData)=>{
    user.set(userData);
    browser && localStorage.setItem("user", JSON.stringify(userData));
}

export const setUserLoggedOut = ()=>{
    user.set({});
    browser && localStorage.removeItem("user");
}