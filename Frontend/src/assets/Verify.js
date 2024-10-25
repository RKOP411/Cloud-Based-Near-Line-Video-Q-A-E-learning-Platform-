import { verifyEmail } from "../assets/Domain.js";

export default async function VerifyEmail() {
  try {
    const response = await fetch(verifyEmail, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }

}