import { auth as middleware } from "./auth";

export default middleware((req)=>{
    console.log("Middleware called", req.nextUrl.pathname);
})

export const config = {
  matcher: ["/login"],
};