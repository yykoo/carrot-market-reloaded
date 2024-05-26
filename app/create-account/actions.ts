"use server"

import {z} from "zod"

const passwordRegex = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
  );
  
const checkUserName = (username:string) => !username.includes("potato")
const checkPasswd = ({passwd, confirm_passwd}:{passwd:string, confirm_passwd:string}) => passwd === confirm_passwd

//const usermaneSchema = z.string().min(5).max(10)
const formSchema = z.object({
    username: z.string({
        invalid_type_error: "username은 문자로 입력해 주세요",
        required_error: "username을 입력해 주세요"
    })
    .min(3, "너무 짧아요")
    .max(10, "10자 이내로 작성해 주세요")
    .toLowerCase()
    .trim()
    .transform((username) => `유저이름 변환 > ${username}`)
    //.refine((username) => !username.includes("potato"), "potato는 안되요."),
    .refine(checkUserName, "potato는 안되요."),
    email: z.string().email().trim(),
    passwd: z.string().min(10).regex(passwordRegex, "A password must have lowercase, Up"),
    confirm_passwd: z.string().min(10),
  //}).refine(checkPasswd, "비밀번호가 일치하지 않아요")
}).refine(checkPasswd, {
    message: "비밀번호가 일치하지 않아요",
    path: ["confirm_passwd"]
})

export async function createAccount(prevState:any, formData:FormData) {
    const data = {
        username: formData.get("username"),
        email : formData.get("email"),
        passwd: formData.get("passwd"),
        confirm_passwd: formData.get("confirm_passwd"),
    }
    const result = formSchema.safeParse(data)

    if(!result.success)
    {
        console.log(result.error.flatten())
        return result.error.flatten()
    } else {
        console.log(result.data)
    }
}