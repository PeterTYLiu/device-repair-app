import React, { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    (async () => {
      let myShopRepairs = await fetch("/api/repairs");
      if (myShopRepairs.status === 200) {
        return (window.location = "/repairs");
      }
      return (window.location = "/login");
    })();
  }, []);

  return (
    <p>
      Please wait for the redirect, or go to <a href="/login">the login page</a>
    </p>
  );
}
