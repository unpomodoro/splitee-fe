import {baseUrl} from "../URL"

export class AuthService {

    static login(data) {
        fetch(`${baseUrl}/auth/signin`, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        }).then(response => {
            if (!response.ok)
                throw Error('Something is wrong')
            return response.json()
        }).then(data => {
            if (data.token) {
                localStorage.setItem('splitee-user', JSON.stringify(data))
            }
            return data
        })
    }

    static logout() {
        localStorage.removeItem('splitee-user')
    }

    static signup(data) {
        fetch(`${baseUrl}/auth/signup`, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        }).then (response => response.json()).then(data => this.login(data))
    }

    static getCurrentUser() {
        return JSON.parse(localStorage.getItem('splitee-user'))
    }
}