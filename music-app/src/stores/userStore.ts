import {writable} from "svelte/store";
import type {User} from "@/models/user";
import {
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithEmailAndPassword
} from 'firebase/auth'
import {doc, setDoc} from 'firebase/firestore'
import {auth, usersCollection} from "@/lib/firebase"

function createUserStore() {
    const {set, subscribe} = writable({
        userLoggedIn: false
    })

    async function register(values: User) {
        const userCred = await createUserWithEmailAndPassword(auth, values.email, values.password)

        await setDoc(doc(usersCollection, userCred.user.uid), {
            name: values.name,
            email: values.email,
            age: values.age,
            country: values.country
        })

        await updateProfile(userCred.user, {displayName: values.name})

        set({userLoggedIn: true})
    }

    async function authenticate(values: { email: string; password: string }) {
        await signInWithEmailAndPassword(auth, values.email, values.password)

        set({userLoggedIn: true})
    }

    async function signOut() {
        await auth.signOut()

        set({userLoggedIn: false})
    }

    async function checkAuth() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                set({userLoggedIn: true})
            } else {
                set({userLoggedIn: false})
            }
        })
    }

    return {
        subscribe,
        register,
        authenticate,
        signOut,
        checkAuth
    }
}

export const userStore = createUserStore()