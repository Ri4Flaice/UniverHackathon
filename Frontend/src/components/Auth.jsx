import React, { useState } from "react";

const Auth = () => {
  const [registerShow, setRegisterShow] = useState(false);
  const [loginShow, setLoginShow] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: "",
    login: "",
    password: "",
    phone: "",
    email: "",
  });
  const [loginData, setLoginData] = useState({
    phone: "",
    password: "",
  });

  const handleRegisterInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    console.log("Registration Form submitted:", registerData);
    // Handle registration logic here (e.g., API call)
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("Login Form submitted:", loginData);
    // Handle login logic here (e.g., API call)
  };

  return (
    <div>
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
      {/* Registration Modal */}
      {registerShow && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-md w-96 text-black">
            <h2 className="text-xl font-bold mb-4">Регистрация</h2>
            <form onSubmit={handleRegisterSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-1">
                  Имя
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={registerData.name}
                  onChange={handleRegisterInputChange}
                  className="border p-2 w-full rounded outline-none"
                  placeholder="Введите ваше имя"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="login" className="block mb-1">
                  Логин
                </label>
                <input
                  type="text"
                  name="login"
                  id="login"
                  value={registerData.login}
                  onChange={handleRegisterInputChange}
                  className="border p-2 w-full rounded outline-none"
                  placeholder="Введите логин"
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
                  value={registerData.password}
                  onChange={handleRegisterInputChange}
                  className="border p-2 w-full rounded outline-none"
                  placeholder="Введите пароль"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block mb-1">
                  Телефон
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={registerData.phone}
                  onChange={handleRegisterInputChange}
                  className="border p-2 w-full rounded outline-none"
                  placeholder="Введите номер телефона"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-1">
                  Почта
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={registerData.email}
                  onChange={handleRegisterInputChange}
                  className="border p-2 w-full rounded outline-none"
                  placeholder="Введите почту"
                  required
                />
              </div>
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
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
