const googleAuthConfig = {
  web: {
    client_id:
      "1063543539522-m89mibo9kp0esu299c8jgj2bali17ltl.apps.googleusercontent.com",
    project_id: "mario-kart-world-guessr",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: "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",
    redirect_uris: [
      "https://www.mariouniversalis.fr/mario-kart-world-guessr/?google",
      "http://localhost:5173/?google",
    ],
    javascript_origins: [
      "https://www.mariouniversalis.fr",
      "http://localhost:5173",
      "http://localhost",
    ],
  },
};
