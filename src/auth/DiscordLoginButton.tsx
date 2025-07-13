const DISCORD_APP_ID = "1393924724299530331";
const redirectUri = `${window.location.origin}${window.location.pathname}`;

export default function DiscordLoginButton() {
  const discordLoginURL = `https://discord.com/oauth2/authorize?client_id=${DISCORD_APP_ID}&response_type=code&redirect_uri=${redirectUri}&scope=email+identify&state=from-discord`;

  return <a href={discordLoginURL}>Login with Discord</a>;
}
