"use client";

import { useState } from "react";

const TestJWTPage = () => {
  const [accessToken, setAccessToken] = useState("");
  const [user, setUser] = useState(null);
  const [refreshToken, setRefreshToken] = useState(false);

  const handleLogin = async () => {
    const email = "booo32339@gmail.com";
    const password = "Ornsoben123";
    fetch(process.env.NEXT_PUBLIC_API_URL + "/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Response When Login", data);
        if (data.accessToken) {
          setAccessToken(data.accessToken);
          setUser(data.user);
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
      });
  };
  const handleUpdate = async () => {
    const body = {
      name: "Test",
    };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/products/${213}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      }
    );
    const data = await res.json();
    console.log("Response When Update", data);
    if (res.status === 401) {
      setRefreshToken(true);
      handleRefreshToken();
    }
  };

  const handleRefreshToken = async () => {
    fetch(process.env.NEXT_PUBLIC_API_URL + "/api/refresh/", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        setAccessToken(data.accessToken);
        console.log("Response When Refresh Token", data);
      })
      .catch((error) => {
        console.error("Refresh Token error:", error);
      });
  };
  return (
    <main className="h-screen grid place-content-center">
      <h1 className="text-4xl font-bold text-center">Test JWT</h1>
      <button
        className="my-4 px-10 py-3 bg-blue-600 rounded-xl text-gray-100 text-3xl"
        onClick={handleLogin}
      >
        Login
      </button>
      {/*refresh token automatically*/}
      <button
        className="my-4 px-10 py-3 bg-blue-600 rounded-xl text-gray-100 text-3xl"
        onClick={handleUpdate}
      >
        Update
      </button>
      {/*{refreshToken && <button className="my-4 px-10 py-3 bg-blue-600 rounded-xl text-gray-100 text-3xl">Refresh Token</button>}*/}
    </main>
  );
};

export default TestJWTPage;
