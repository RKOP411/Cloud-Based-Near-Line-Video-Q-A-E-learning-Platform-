import { verifyAccount } from "../assets/Domain.js";

verifyAccount();
{
    const response = await fetch(verifyAccount, {
        // Use register directly
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
    });
}