import React, { useState } from "react";

import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Auth = () => {
  const [registerShow, setRegisterShow] = useState(false);
  const [loginShow, setLoginShow] = useState(false);
  const [registerData, setRegisterData] = useState({
    fullName: "",
    login: "",
    password: "",
    phoneNumber: "",
    email: "",
  });
  const [loginData, setLoginData] = useState({
    phone: "",
    password: "",
  });

  const { isLoggedIn, login, logout } = useAuth();

  const handleRegisterInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8081/api/User/create", registerData);
      setRegisterShow(false);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    await login(loginData);
    setLoginShow(false);
  };

  return (
    <div>
      {!isLoggedIn ? (
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setRegisterShow((prev) => !prev)}
            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
          >
            Регистрация
          </button>
          <button
            onClick={() => setLoginShow((prev) => !prev)}
            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
          >
            Вход
          </button>
        </div>
      ) : (
        <button
          onClick={logout}
          className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
        >
          Выйти
        </button>
      )}

      {registerShow && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-md w-96 text-black">
            <h2 className="text-xl font-bold mb-4">Регистрация</h2>
            <form onSubmit={handleRegisterSubmit}>
              {["fullName", "login", "password", "phoneNumber", "email"].map(
                (field, idx) => (
                  <div className="mb-4" key={idx}>
                    <label htmlFor={field} className="block mb-1">
                      {field === "fullName"
                        ? "Имя"
                        : field === "phoneNumber"
                        ? "Телефон"
                        : field}
                    </label>
                    <input
                      type={field === "password" ? "password" : "text"}
                      name={field}
                      id={field}
                      value={registerData[field]}
                      onChange={handleRegisterInputChange}
                      className="border p-2 w-full rounded outline-none"
                      placeholder={`Введите ${field}`}
                      required
                    />
                  </div>
                )
              )}
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
              >
                Зарегистрироваться
              </button>
            </form>
            <button
              onClick={() => setRegisterShow(false)}
              className="mt-4 text-red-500"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {loginShow && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-md w-96 text-black">
            <h2 className="text-xl font-bold mb-4">Вход</h2>
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-4">
                <label htmlFor="phone" className="block mb-1">
                  Телефон
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={loginData.phone}
                  onChange={handleLoginInputChange}
                  className="border p-2 w-full rounded outline-none"
                  placeholder="Введите номер телефона"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block mb-1">
                  Пароль
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={loginData.password}
                  onChange={handleLoginInputChange}
                  className="border p-2 w-full rounded outline-none"
                  placeholder="Введите пароль"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
              >
                Войти
              </button>
            </form>
            <button
              onClick={() => setLoginShow(false)}
              className="mt-4 text-red-500"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
