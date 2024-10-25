import { verifyEmailDomain } from "../assets/Domain.js";

export default async function VerifyEmail() {
  const email = document.getElementById("email").value;
  const response = await fetch(`${verifyEmailDomain}?email=${email}`);
  const data = await response.json();
  console.log(data);
  if (data.length > 0) {
    console.log("Email already exists");
    return false;
  } else {
    console.log("Email is available");
    return true;
  }

}


export { VerifyEmail };
