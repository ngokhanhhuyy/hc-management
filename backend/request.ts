async function mainAsync(): Promise<void> {
  const authenticationResponse = await fetch("http://localhost:5000/api/authentication/get-access-cookie", {
    method: "post",
    body: JSON.stringify({
      userName: "admin",
      password: "admin"
    })
  });

  const cookies = authenticationResponse.headers.get("Set-Cookie") ?? undefined;
  console.log(cookies);


  for (let index = 0; index < 100; index += 1) {
    const startTime = performance.now();
    await fetch("http://localhost:5000/health-check", {
      method: "get",
      headers: cookies ? {
        "Cookie": cookies
      } : undefined
    }).then(response => response.json());

    const duration = performance.now() - startTime;
    console.log(duration.toFixed(2) + "ms");
  }
}

mainAsync();
