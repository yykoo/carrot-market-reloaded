"use server"

import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from "@/lib/constants";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string({
    required_error: "Password is required"
  }).min(PASSWORD_MIN_LENGTH).regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
})

export async function login(prevState: any, formData: FormData) {
    console.log(prevState);

    const data = {
      email: formData.get('email'),
      password: formData.get("passwd"),
    }
    console.log(data)
    const result = formSchema.safeParse(data)

    if(!result.success) {
      console.log(result.error.flatten())
      return result.error.flatten()
    } else {
      console.log(`success > ${result.data}`)
    }
  }
