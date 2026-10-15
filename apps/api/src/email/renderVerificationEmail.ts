export default function renderVerificationEmail(url: string) {
  return (
    `
    <h3>Verify your email address</h3>
    <p>Click the button below to verify your email address. If the button does not render, click the provided link instead.</p>
    <button><a href=${url}>Verify email</a></button>
    <p>If the button doesn't work, copy and paste this link into your browser: <${url}></p>
    <br>
    <h4>Globe Trotter</h4>
    <em style="font-size: 0.8rem">If this wasn't you, ignore this email.</em>
    `
  )
}
