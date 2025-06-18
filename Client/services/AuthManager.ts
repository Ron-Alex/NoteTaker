export class AuthManager{
    private currentUser: string | null = null;
    private authorized: boolean = false;

    constructor(){
        
    }

    getUser(): string{
        if(this.currentUser){
            return this.currentUser;
        }
        return "";
    }

    setUser(user_id: string): void{
        this.currentUser = user_id;
    }

    setAuthorize(status: boolean): void{
        this.authorized = status;
    }

    async registerUser(userName: string, email: string, password: string): Promise<string>{
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
        return data.user_id;
    }
}