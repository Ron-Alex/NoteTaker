import { StorageService } from "../Storage/StorageService.js";

export class AuthManager{
    private currentUser: string | null = null;
    private authorized: boolean = false;

    constructor(){
        
    }

    getUser(): string | null{
        if(this.currentUser){
            return this.currentUser;
        }
        return null;
    }

    getAuthorized(): boolean{
        return this.authorized;
    }

    setUser(user_id: string): void{
        this.currentUser = user_id;
    }

    setAuthorize(status: boolean): void{
        this.authorized = status;
    }

    setToken(token: string): void {
        StorageService.saveToken(token);
    }

    async registerUser(userName: string, email: string, password: string): Promise<any>{
        const response = await fetch("http://localhost:4000/register", {
            method: "post",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: userName,
                email: email,
                password: password
            })
        });
        if(!response.ok) throw new Error("Could not Register");
        const data = await response.json();
        return {
            user_id: data.user_id,
            token: data.token
        };
    }

    async signIn(email: string, password: string){
        const response = await fetch("http://localhost:4000/signin", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        if(!response.ok) throw new Error("Wrong Credentials");
        const user_notes = await response.json();
        return {
            // user_id: user_notes.user_id,
            notes: user_notes.data,
            token: user_notes.token
        }
    }
}