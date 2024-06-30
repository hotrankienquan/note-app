import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";

import { http } from "./http/make-request";
import { signal } from "@preact/signals";
import { IApiResponse, IResLogin } from "./interface/request.type";
import classNames from "classnames";
import axios, { AxiosError } from "axios";
import { loginSchema } from "./schema/schema-validate-form";
import { IDataRegister, ILogin } from "./interface/common";
import { cookiesBrowser } from "./cookie/cookie-browser";
import { COOKIE_USER } from "./constants/common";
import { useEffect } from "react";


const registerSignal = signal<IDataRegister>({
  errorMessage:"",
  memento: undefined,
  data: null
});


const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ILogin>({
    resolver: yupResolver(loginSchema),
  });
  const navigate = useNavigate()
  const onSubmit: SubmitHandler<ILogin> = async (data) => {
    registerSignal.value =  {
      ...registerSignal.value,
      memento: registerSignal.value
    }
    try {
      const result = await http.post<ILogin, IApiResponse<IResLogin>>("/login", {
        ...data,
      });
      if(result.status !== 200){
        //failed
        registerSignal.value =  {
          ...registerSignal.value,
          memento: registerSignal.value,
          errorMessage: result.message ?? "some error occured"
        }
      }
      //succeed
      registerSignal.value =  {
        ...registerSignal.value,
        memento: undefined,
        errorMessage: result.message,
        data: result?.metadata
      }
      
      cookiesBrowser.set(COOKIE_USER, JSON.stringify(result?.metadata))
      reset({
        email:"",
        password:"",
      })
      navigate("/")
    } catch (error) { /* empty */
      const errors = error as AxiosError<{
        code: number;
        message: string;
        stack: string;
        status: string;
      }>;
      if(!axios.isAxiosError(error)){
        // do whatever you want with native error
        console.log('native error', errors);
        
      }
      console.log("your error", errors?.response?.data?.message);
      registerSignal.value.errorMessage = errors?.response?.data?.message;
      registerSignal.value.memento = undefined;
      // do what you want with your axios error
     }
  };
  useEffect(()=>{
    if(cookiesBrowser.get(COOKIE_USER)){
      window.location.href = '/'
    }
  },[])
  return (
    <div className="font-sans antialiased bg-grey-lightest">
      <div className="w-full bg-green fixed shadow z-1">
        <div className="container mx-auto">
          <div className="w-full flex justify-between items-center py-4 px-8">
            <div className="text-center text-[#333] font-bold">
              Your Company
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-grey-lightest" style={{ paddingTop: "4rem" }}>
        <div className="container mx-auto py-8">
          <div className="w-5/6 lg:w-1/2 mx-auto bg-white rounded shadow">
            <div className="py-4 px-8 text-black text-xl border-b border-grey-lighter">
              Đăng nhập
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="py-4 px-8">
                <div className="mb-4">
                  <label
                    className="block text-grey-darker text-sm font-bold mb-2"
                    htmlFor="email"
                  >
                    Email của bạn
                  </label>
                  <input
                    className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                    id="email"
                    type="email"
                    placeholder="Your email address"
                    {...register("email", { required: true })}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-grey-darker text-sm font-bold mb-2"
                    htmlFor="password"
                  >
                    Nhập mật khẩu
                  </label>
                  <input
                    className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                    id="password"
                    type="password"
                    placeholder="Your secure password"
                    {...register("password", { required: true })}
                  />
                </div>
                <div>
                  {errors.email && <span>{errors.email.message}</span>}
                  {errors.password && <span>{errors.password.message}</span>}
                  {registerSignal.value.errorMessage && <span>{registerSignal.value.errorMessage}</span>}
                </div>
                <div className="flex items-center justify-between mt-8">
                  <button
                    disabled={!!registerSignal.value.memento}
                    className={classNames("mx-auto border-[1px] border-[#ccc] border-solid opacity-100 hover:opacity-70 cursor-pointer text-[#333] font-bold py-2 px-4 rounded-sm",{
                      "bg-gray-200": Boolean(registerSignal.value.memento)
                    })}
                    type="submit"
                  >
                    {(registerSignal.value.memento) ? "loading..." : "Let'sgo"}
                  </button>
                </div>
              </div>
            </form>
          </div>
          <p className="text-center my-4">
            <Link
              to="/register"
              className="text-grey-dark text-sm hover:text-pink-400 "
            >
              Qua trang đăng ký
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
