"use client";

import { useState } from "react";

const TestJWTPage = () => {
  const [accessToken, setAccessToken] = useState("");
	const [user, setUser] = useState(null);
	const [unAthorized, setUnAuthorized] = useState(false);

	// handle login
	const handleLogin = async () => {
		const email = "booo32339@gmail.com";
		const password = "Ornsoben123";

		fetch(process.env.NEXT_PUBLIC_API_URL + "/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("Data : ", data);
				setAccessToken(data.accessToken);
				setUser(data.user);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	// handle patial update
	const handlePartialUpdate = async () => {
		const body = {
			name: "test update",
		};
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/products/${599}`,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify(body),
			}
		);

		if (res.status === 401) {
			setUnAuthorized(true);
		}

		const data = await res.json();
		console.log("Data from partial update: ", data);
	};

	// handle refresh token
	const handleRefreshToken = async () => {
		fetch(process.env.NEXT_PUBLIC_API_URL + "/refresh", {
			method: "POST",
			credentials: "include",
			body: JSON.stringify({}),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("Data from refresh token: ", data);
				setAccessToken(data.accessToken);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	
	return (
		<main className="h-screen grid place-content-center">
			<button
				onClick={handleLogin}
				className="my-4 p-4 bg-blue-600 rounded-xl text-3xl text-gray-100"
			>
				Login
			</button>
			<button
				onClick={handlePartialUpdate}
				className="my-4 p-4 bg-blue-600 rounded-xl text-3xl text-gray-100"
			>
				Partial Update
			</button>
			{unAthorized && (
				<button
					onClick={handleRefreshToken}
					className="my-4 p-4 bg-blue-600 rounded-xl text-3xl text-gray-100"
				>
					Refresh
				</button>
			)}
    </main>
  );
};

export default TestJWTPage;
